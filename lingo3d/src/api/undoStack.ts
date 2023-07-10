import { uuidMapAssertGet } from "../collections/idCollections"
import { flushMultipleSelectionTargets } from "../states/useMultipleSelectionTargets"
import { createUnloadArray } from "../utils/createUnloadMap"
import deserialize from "./serializer/deserialize"
import { AppendableNode } from "./serializer/types"

export type CreateCommand = { command: "create" } & AppendableNode
export type DeleteCommand = { command: "delete" } & AppendableNode
export type UpdateCommand = {
    command: "update"
    commandPrev: Record<string, any>
    commandNext?: Record<string, any>
}
export type MoveCommand = {
    command: "move"
    commandFrom: string
    commandTo: string
}
export type GroupCommand = {
    command: "group"
    commandChildren: Array<string>
    commandParents: Array<string>
} & AppendableNode

export type CommandRecord = Record<
    string, //uuid
    CreateCommand | DeleteCommand | UpdateCommand | MoveCommand | GroupCommand
>

const undoStack = createUnloadArray<CommandRecord>()
const redoStack = createUnloadArray<CommandRecord>()

export const pushUndoStack = (commandRecord: CommandRecord) => {
    undoStack.push(commandRecord)
    redoStack.length = 0
}

export const undo = () =>
    flushMultipleSelectionTargets(() => {
        const commandRecord = undoStack.pop()
        if (!commandRecord) return
        for (const [uuid, command] of Object.entries(commandRecord)) {
            const manager = uuidMapAssertGet(uuid)
            if (command.command === "update")
                Object.assign(manager, command.commandPrev)
            else if (command.command === "delete") deserialize([command])
            else if (command.command === "create") manager.dispose()
            else if (command.command === "group") {
                let i = 0
                for (const uuid of command.commandChildren) {
                    const child = uuidMapAssertGet(uuid)
                    const parent = uuidMapAssertGet(command.commandParents[i++])
                    parent.attach(child)
                }
                manager.dispose()
            } else if (command.command === "move")
                uuidMapAssertGet(command.commandFrom).attach(manager)
        }
        redoStack.push(commandRecord)
    }, true)

export const redo = () =>
    flushMultipleSelectionTargets(() => {
        const commandRecord = redoStack.pop()
        if (!commandRecord) return
        for (const [uuid, command] of Object.entries(commandRecord)) {
            const manager = uuidMapAssertGet(uuid)
            if (command.command === "update")
                Object.assign(manager, command.commandNext)
            else if (command.command === "delete") manager.dispose()
            else if (command.command === "create") deserialize([command])
            else if (command.command === "group") {
                const group = deserialize([command as any])[0]!
                for (const uuid of command.commandChildren)
                    group.attach(uuidMapAssertGet(uuid))
            } else if (command.command === "move")
                uuidMapAssertGet(command.commandTo).attach(manager)
        }
        undoStack.push(commandRecord)
    }, true)
