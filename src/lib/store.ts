"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

export type Listener = () => void;

// Context re-renders every consumer on any change; this subscribes per slice.
export class Store<T extends object> {
  private state: T;
  private listeners = new Set<Listener>();

  constructor(initial: T) {
    this.state = initial;
  }

  get = (): T => this.state;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  set = (patch: Partial<T> | ((current: T) => Partial<T>)): void => {
    const delta = typeof patch === "function" ? patch(this.state) : patch;
    let changed = false;
    for (const key of Object.keys(delta) as (keyof T)[]) {
      if (!Object.is(this.state[key], delta[key])) {
        changed = true;
        break;
      }
    }
    if (!changed) return;
    this.state = { ...this.state, ...delta };
    for (const listener of this.listeners) listener();
  };
}

export function createSelectorHook<T extends object>(store: Store<T>) {
  return function useSelector<S>(
    selector: (state: T) => S,
    isEqual: (a: S, b: S) => boolean = Object.is,
  ): S {
    const lastState = useRef<T | null>(null);
    const lastResult = useRef<S | null>(null);

    const getSnapshot = useCallback(() => {
      const state = store.get();
      if (lastState.current === state && lastResult.current !== null) {
        return lastResult.current;
      }
      const next = selector(state);
      lastState.current = state;
      if (lastResult.current !== null && isEqual(lastResult.current, next)) {
        return lastResult.current;
      }
      lastResult.current = next;
      return next;
    }, [selector, isEqual]);

    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
  };
}

export const shallowArrayEqual = <T,>(a: readonly T[], b: readonly T[]): boolean =>
  a.length === b.length && a.every((item, index) => Object.is(item, b[index]));
