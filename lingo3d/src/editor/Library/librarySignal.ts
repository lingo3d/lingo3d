import { Signal, signal } from "@preact/signals"

export const librarySignal: Signal<"components" | "templates"> =
    signal("components")
