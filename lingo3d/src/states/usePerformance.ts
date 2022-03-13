import store from "@lincode/reactivity"

export type PerformanceValue = "quality" | "speed" | "balanced"

export const [setPerformance, getPerformance] = store<PerformanceValue>("balanced")