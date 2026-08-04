"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { logClientError } from "@/lib/logging/client";

type Props = { children: ReactNode };
type State = { hasError: boolean };

/** Isolates ContactMenu failures so they cannot blank the rest of the page. */
export class ContactMenuBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logClientError("ContactMenuBoundary", error, {
      componentStack: info.componentStack,
    });
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
