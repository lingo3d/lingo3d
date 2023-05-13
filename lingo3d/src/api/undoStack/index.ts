type CreateRecord = { type: "create"; uuid: string }
type DeleteRecord = { type: "delete"; uuid: string }
type UpdateRecord = { type: "update"; uuid: string; prev: any; next: any }
type MoveRecord = { type: "move"; uuid: string; from: any; to: any }
type UndoRecord = CreateRecord | DeleteRecord | UpdateRecord | MoveRecord

export const undoStack: Array<UndoRecord> = []

export const undo = () => {}

export const redo = () => {}
