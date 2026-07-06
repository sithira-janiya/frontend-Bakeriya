import { Component } from 'react'

/**
 * App-level safety net. React unmounts the whole tree if a render/lifecycle
 * error escapes — this class component catches that and shows a recoverable
 * fallback instead of a blank white screen.
 *
 * Only render/lifecycle errors are caught (that's how React error boundaries
 * work); async rejections are handled at their call sites via ApiError. "Try
 * again" re-mounts the subtree; "Reload" does a hard refresh as a last resort.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
    this.handleRetry = this.handleRetry.bind(this)
    this.handleReload = this.handleReload.bind(this)
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // Surface it for developers; never let logging itself throw.
    try {
      // eslint-disable-next-line no-console
      console.error('Unexpected UI error caught by ErrorBoundary:', error, info)
    } catch {
      /* ignore */
    }
  }

  handleRetry() {
    this.setState({ hasError: false })
  }

  handleReload() {
    try {
      window.location.reload()
    } catch {
      /* ignore */
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-amber-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100">
        <div className="max-w-md w-full text-center rounded-2xl border border-amber-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur p-8 shadow-sm">
          <div className="text-5xl mb-4" aria-hidden="true">
            🥐
          </div>
          <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
            The page hit an unexpected error. You can try again, or reload if it keeps happening.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleRetry}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm font-medium transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    )
  }
}
