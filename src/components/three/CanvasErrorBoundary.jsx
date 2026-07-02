import { Component } from 'react'

/**
 * Catches WebGL / Three.js failures (e.g. "Error creating WebGL context" on
 * machines without GPU acceleration) so a broken 3D scene degrades gracefully
 * instead of crashing the whole app. Renders `fallback` (default: nothing).
 */
export default class CanvasErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.warn('3D scene disabled:', error?.message)
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}
