import { createMachine, interpret } from "xstate"
import { Model, pillShape } from "../.."

//@ts-ignore
import botSrc from "../../../assets-local/bot.fbx"
//@ts-ignore
import runningSrc from "../../../assets-local/running.fbx"
//@ts-ignore
import idleSrc from "../../../assets-local/idle.fbx"
//@ts-ignore
import aimSrc from "../../../assets-local/aim.fbx"
//@ts-ignore
import aimWalkSrc from "../../../assets-local/aim-walk.fbx"
//@ts-ignore
import recoilSrc from "../../../assets-local/recoil.fbx"
//@ts-ignore
import fallingSrc from "../../../assets-local/falling.fbx"

export default () => {
    const characterModel = new Model()
    characterModel.src = botSrc
    characterModel.width = 30
    characterModel.depth = 30
    characterModel.y = 50
    characterModel.physicsShape = pillShape

    characterModel.loadAnimation(runningSrc)
    characterModel.loadAnimation(idleSrc)
    characterModel.loadAnimation(aimSrc)
    characterModel.loadAnimation(aimWalkSrc)
    characterModel.loadAnimation(recoilSrc)
    characterModel.loadAnimation(fallingSrc)

    characterModel.playAnimation(idleSrc)

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
                    characterModel.playAnimation(idleSrc)
                }
            },
            move: {
                on: {
                    MOVE_OFF: { target: "idle" },
                    AIM_ON: { target: "aimMove" },
                    JUMP_ON: { target: "jump" }
                },
                entry: () => {
                    characterModel.playAnimation(runningSrc)
                }
            },
            aim: {
                on: {
                    AIM_OFF: { target: "recoil" },
                    MOVE_ON: { target: "aimMove" },
                    JUMP_ON: { target: "jump" }
                },
                entry: () => {
                    characterModel.playAnimation(aimSrc)
                }
            },
            aimMove: {
                on: {
                    MOVE_OFF: { target: "aim" },
                    AIM_OFF: { target: "recoil" },
                    JUMP_ON: { target: "jump" }
                },
                entry: () => {
                   characterModel.playAnimation(aimWalkSrc)
                }
            },
            jump: {
                on: {
                    JUMP_OFF: { target: "idle" }
                },
                entry: () => {
                    characterModel.playAnimation(fallingSrc)
                }
            },
            recoil: {
                on: {
                    RECOIL_OFF: { target: "idle" }
                },
                entry: () => {
                    characterModel.playAnimation(recoilSrc, { repeat: false, onFinish: () => characterService.send("RECOIL_OFF") })
                }
            }
        }
    })

    const characterService = interpret(characterMachine).start()

    return { characterModel, characterService }
}