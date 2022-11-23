import { event } from "@lincode/events"

export const [emitEditorEdit, onEditorEdit] = event<"start" | "stop">()
