'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getCheckoutStatus } from '@/lib/checkout-api';
import type { CheckoutStatus } from '@/types/checkout';

const TERMINAL_STATUSES: CheckoutStatus[] = ['COMPLETED', 'FAILED', 'EXPIRED', 'CANCELLED'];

/**
 * How long to keep polling past the session's own expiry.
 *
 * The backend settles a checkout from the provider callback, and when that
 * callback is late the reconciliation cycle resolves it instead. Both can land
 * slightly after the countdown reaches zero, so stopping exactly on expiry
 * would leave the payer looking at a spinner for a payment that did complete.
 */
const GRACE_PERIOD_MS = 90_000;

/** Fallback budget when the session carries no usable expiry. */
const DEFAULT_MAX_DURATION_MS = 600_000;

interface UseCheckoutStatusOptions {
  publicToken: string;
  initialStatus: CheckoutStatus;
  pollIntervalMs?: number;
  /**
   * When the checkout session itself expires. Polling runs until this plus a
   * grace period, rather than a fixed window that can be shorter than the
   * session — which used to stop the poll while the payment was still live.
   */
  expiresAt?: string | number | Date | null;
  maxDurationMs?: number;
  onStatusChange?: (newStatus: CheckoutStatus, failureReason?: string | null) => void;
}

function resolveDeadline(
  expiresAt: UseCheckoutStatusOptions['expiresAt'],
  fallbackMs: number
): number {
  if (expiresAt) {
    const parsed = new Date(expiresAt).getTime();
    if (Number.isFinite(parsed)) {
      return parsed + GRACE_PERIOD_MS;
    }
  }
  return Date.now() + fallbackMs;
}

export function useCheckoutStatus({
  publicToken,
  initialStatus,
  pollIntervalMs = 2500,
  expiresAt = null,
  maxDurationMs = DEFAULT_MAX_DURATION_MS,
  onStatusChange,
}: UseCheckoutStatusOptions) {
  const [status, setStatus] = useState<CheckoutStatus>(initialStatus);
  const [failureReason, setFailureReason] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(initialStatus === 'PROCESSING');
  const [error, setError] = useState<string | null>(null);
  const [isCheckingNow, setIsCheckingNow] = useState<boolean>(false);

  const deadlineRef = useRef<number>(resolveDeadline(expiresAt, maxDurationMs));
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isUnmountedRef = useRef<boolean>(false);
  const callbackRef = useRef(onStatusChange);
  // Read inside the polling loop so a status change does not tear the loop down
  // and rebuild it, which previously discarded an in-flight response.
  const statusRef = useRef<CheckoutStatus>(initialStatus);
  const isPollingRef = useRef<boolean>(initialStatus === 'PROCESSING');

  useEffect(() => {
    callbackRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    deadlineRef.current = resolveDeadline(expiresAt, maxDurationMs);
  }, [expiresAt, maxDurationMs]);

  const stopPolling = useCallback(() => {
    isPollingRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPolling(false);
  }, []);

  /** Applies a freshly read status, notifying the caller only on a real change. */
  const applyStatus = useCallback(
    (newStatus: CheckoutStatus, reason: string | null) => {
      if (newStatus === statusRef.current) return false;

      statusRef.current = newStatus;
      setStatus(newStatus);
      setFailureReason(reason);
      callbackRef.current?.(newStatus, reason);
      return true;
    },
    []
  );

  // The loop reschedules itself, so it goes through a ref rather than
  // referencing the callback from inside its own definition.
  const pollRef = useRef<() => void>(() => {});

  const poll = useCallback(async () => {
    if (!publicToken || isUnmountedRef.current) return;

    try {
      const res = await getCheckoutStatus(publicToken);
      if (isUnmountedRef.current) return;

      applyStatus(res.status, res.failureReason || null);
      setError(null);

      if (TERMINAL_STATUSES.includes(res.status)) {
        stopPolling();
        return;
      }
    } catch {
      if (isUnmountedRef.current) return;
      // A network hiccup is not a verdict on the payment — keep trying until
      // the deadline rather than abandoning a live checkout.
    }

    if (isUnmountedRef.current || !isPollingRef.current) return;

    if (Date.now() >= deadlineRef.current) {
      stopPolling();
      setError(
        'We have not had confirmation from your provider yet. If you approved the payment on your handset, check again in a moment — it may still be settling.'
      );
      return;
    }

    timerRef.current = setTimeout(() => pollRef.current(), pollIntervalMs);
  }, [publicToken, pollIntervalMs, applyStatus, stopPolling]);

  useEffect(() => {
    pollRef.current = () => {
      void poll();
    };
  }, [poll]);

  const startPolling = useCallback(() => {
    if (isPollingRef.current) return;
    isPollingRef.current = true;
    setIsPolling(true);
    setError(null);
  }, []);

  /** Manual re-check, for when polling has given up but the payer is still here. */
  const checkNow = useCallback(async () => {
    if (!publicToken || isCheckingNow) return;

    setIsCheckingNow(true);
    setError(null);
    try {
      const res = await getCheckoutStatus(publicToken);
      if (isUnmountedRef.current) return;

      applyStatus(res.status, res.failureReason || null);

      if (!TERMINAL_STATUSES.includes(res.status)) {
        // Still live — give it another full window rather than one lookup.
        deadlineRef.current = Math.max(
          deadlineRef.current,
          Date.now() + GRACE_PERIOD_MS
        );
        isPollingRef.current = true;
        setIsPolling(true);
      }
    } catch {
      if (isUnmountedRef.current) return;
      setError('Could not reach the payment service. Please try again.');
    } finally {
      if (!isUnmountedRef.current) setIsCheckingNow(false);
    }
  }, [publicToken, isCheckingNow, applyStatus]);

  // One loop, owned by the polling flag alone. It deliberately does not depend
  // on `status`: making the loop depend on the value it writes tore it down on
  // every transition and could drop the very response being processed.
  useEffect(() => {
    if (!isPolling) return;

    isPollingRef.current = true;
    timerRef.current = setTimeout(() => pollRef.current(), pollIntervalMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPolling, poll, pollIntervalMs]);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  // A status set from outside (initiating a payment, reloading mid-flight)
  // should resume polling on its own.
  useEffect(() => {
    if (status === 'PROCESSING' && !isPolling) {
      startPolling();
    }
  }, [status, isPolling, startPolling]);

  return {
    status,
    setStatus,
    failureReason,
    isPolling,
    isCheckingNow,
    error,
    startPolling,
    stopPolling,
    checkNow,
  };
}
