import { uuidMap } from "../collections/idCollections"
import SimpleObjectManager from "../display/core/SimpleObjectManager"
import { flushMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import deserialize from "./serializer/deserialize"
import { AppendableNode } from "./serializer/types"

export type CreateCommand = { command: "create" } & AppendableNode
export type DeleteCommand = { command: "delete" } & AppendableNode
export type UpdateCommand = {
    command: "update"
    prev: Record<string, any>
    next?: Record<string, any>
}
export type MoveCommand = { command: "move"; from: string; to: string }
export type CommandRecord = Record<
    string, //uuid
    CreateCommand | DeleteCommand | UpdateCommand | MoveCommand
>

const undoStack: Array<CommandRecord> = []
const redoStack: Array<CommandRecord> = []

export const pushUndoStack = (commandRecord: CommandRecord) => {
    undoStack.push(commandRecord)
    redoStack.length = 0
}

export const undo = () =>
    flushMultipleSelectionTargets(() => {
        const commandRecord = undoStack.pop()
        if (!commandRecord) return
        for (const [uuid, command] of Object.entries(commandRecord)) {
            const manager = uuidMap.get(uuid) as SimpleObjectManager
            if (command.command === "update")
                Object.assign(manager, command.prev)
            else if (command.command === "delete") deserialize([command])
            else if (command.command === "create") manager.dispose()
        }
        redoStack.push(commandRecord)
    }, true)

export const redo = () =>
    flushMultipleSelectionTargets(() => {
        const commandRecord = redoStack.pop()
        if (!commandRecord) return
        for (const [uuid, command] of Object.entries(commandRecord)) {
            const manager = uuidMap.get(uuid) as SimpleObjectManager
            if (command.command === "update")
                Object.assign(manager, command.next)
            else if (command.command === "delete") manager.dispose()
            else if (command.command === "create") deserialize([command])
        }
        undoStack.push(commandRecord)
    }, true)
