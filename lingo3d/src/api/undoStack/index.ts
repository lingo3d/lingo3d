export type CreateRecord = { type: "create" }
export type DeleteRecord = { type: "delete" }
export type UpdateRecord = { type: "update"; prev: any; next?: any }
export type MoveRecord = { type: "move"; from: any; to: any }
export type UndoRecord = Record<
    string, //uuid
    CreateRecord | DeleteRecord | UpdateRecord | MoveRecord
>

export const undoStack: Array<UndoRecord> = []

export const undo = () => {}

export const redo = () => {}
