import { Signal, signal } from "@preact/signals"

export const librarySignal: Signal<Array<"components" | "templates">> = signal([
    "components"
])
