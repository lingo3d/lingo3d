import { uuidMap } from "../collections/idCollections"
import SimpleObjectManager from "../display/core/SimpleObjectManager"

export type CreateRecord = { type: "create" }
export type DeleteRecord = { type: "delete" }
export type UpdateRecord = {
    type: "update"
    prev: Record<string, any>
    next?: Record<string, any>
}
export type MoveRecord = { type: "move"; from: any; to: any }
export type UndoRecord = Record<
    string, //uuid
    CreateRecord | DeleteRecord | UpdateRecord | MoveRecord
>

export const undoStack: Array<UndoRecord> = []
export const redoStack: Array<UndoRecord> = []

export const undo = () => {
    const record = undoStack.pop()
    if (!record) return
    for (const [uuid, data] of Object.entries(record)) {
        const manager = uuidMap.get(uuid) as SimpleObjectManager
        if (data.type === "update") Object.assign(manager, data.prev)
    }
    redoStack.push(record)
}

export const redo = () => {
    const record = redoStack.pop()
    if (!record) return
    for (const [uuid, data] of Object.entries(record)) {
        const manager = uuidMap.get(uuid) as SimpleObjectManager
        if (data.type === "update") Object.assign(manager, data.next)
    }
    undoStack.push(record)
}
