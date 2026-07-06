import { useCallback, useMemo } from 'react'
import ToastViewport from '../components/toast/ToastViewport.jsx'
import { useAppDispatch, useAppSelector } from '../app/hooks.js'
import { selectToasts, showToast as showToastAction, dismiss as dismissAction } from '../features/toast/toastSlice.js'

/**
 * Toasts are Redux-backed now (see features/toast/toastSlice.js). These exports
 * keep the original API — `useToast().showToast(...)` / `.dismiss(id)` and the
 * <ToastProvider> that renders the viewport — so existing callers are unchanged.
 *
 * Deliberately store-agnostic: any component can raise a toast. The order-status
 * stream is wired in separately by <OrderStatusToaster/>.
 */

export function ToastProvider({ children }) {
  const toasts = useAppSelector(selectToasts)
  const dispatch = useAppDispatch()
  const onDismiss = useCallback((id) => dispatch(dismissAction(id)), [dispatch])

  return (
    <>
      {children}
      <ToastViewport toasts={toasts} onDismiss={onDismiss} />
    </>
  )
}

export function useToast() {
  const dispatch = useAppDispatch()

  const showToast = useCallback(
    (toast) => {
      // Build the action first so we can hand the generated id back to the
      // caller (same contract the old context had).
      const action = showToastAction(toast)
      dispatch(action)
      return action.payload.id
    },
    [dispatch]
  )

  const dismiss = useCallback((id) => dispatch(dismissAction(id)), [dispatch])

  return useMemo(() => ({ showToast, dismiss }), [showToast, dismiss])
}
