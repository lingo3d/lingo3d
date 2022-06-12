import { createMachine, interpret } from "xstate"
import { Model, pillShape } from "../.."

export default () => {
    const characterModel = new Model()
    characterModel.src = "bot.fbx"
    characterModel.width = 30
    characterModel.depth = 30
    characterModel.y = 50
    characterModel.physicsShape = pillShape

    characterModel.loadAnimation("running.fbx")
    characterModel.loadAnimation("idle.fbx")
    characterModel.loadAnimation("aim.fbx")
    characterModel.loadAnimation("aim-walk.fbx")
    characterModel.loadAnimation("recoil.fbx")
    characterModel.loadAnimation("falling.fbx")

    characterModel.playAnimation("idle.fbx")

    const characterMachine = createMachine({
        initial: "idle",
        states: {
            idle: {
                on: {
                    MOVE_ON: { target: "move" },
                    AIM_ON: { target: "aim" },
                    JUMP_ON: { target: "jump" }
                },
                entry: () => {
                    characterModel.playAnimation("aim.fbx")
                }
            },
            move: {
                on: {
                    MOVE_OFF: { target: "idle" },
                    AIM_ON: { target: "aimMove" },
                    JUMP_ON: { target: "jump" }
                },
                entry: () => {
                    characterModel.playAnimation("running.fbx")
                }
            },
            aim: {
                on: {
                    AIM_OFF: { target: "recoil" },
                    MOVE_ON: { target: "aimMove" },
                    JUMP_ON: { target: "jump" }
                },
                entry: () => {
                    characterModel.playAnimation("aim.fbx")
                }
            },
            aimMove: {
                on: {
                    MOVE_OFF: { target: "aim" },
                    AIM_OFF: { target: "recoil" },
                    JUMP_ON: { target: "jump" }
                },
                entry: () => {
                   characterModel.playAnimation("aim-walk.fbx")
                }
            },
            jump: {
                on: {
                    JUMP_OFF: { target: "idle" }
                },
                entry: () => {
                    characterModel.playAnimation("falling.fbx")
                }
            },
            recoil: {
                on: {
                    RECOIL_OFF: { target: "idle" }
                },
                entry: () => {
                    characterModel.playAnimation("recoil.fbx", { repeat: false, onFinish: () => characterService.send("RECOIL_OFF") })
                }
            }
        }
    })

    const characterService = interpret(characterMachine).start()

    return { characterModel, characterService }
}