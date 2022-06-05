import Model from "../display/Model"
//@ts-ignore
import botSrc from "../../assets-local/bot.fbx"
//@ts-ignore
import playerSrc from "../../assets-local/readyplayer.glb"
import store, { createEffect } from "@lincode/reactivity"
import FoundManager from "../display/core/FoundManager"
import Cube from "../display/primitives/Cube"
import { Sphere } from ".."
import Tetrahedron from "../display/primitives/Tetrahedron"

export default {}

const bone = new Tetrahedron()
bone.wireframe = true

// const player = new Model()
// player.src = playerSrc
// player.x = 100

// const bot = new Model()
// bot.src = botSrc

// const [setJoints, getJoints] = store<Record<string, FoundManager> | undefined>(undefined)
// bot.loadedResolvable.then(() => setJoints({
//     spine: bot.find("mixamorigSpine")!,
//     rightUpLeg: bot.find("mixamorigRightUpLeg")!,
//     rightLeg: bot.find("mixamorigRightLeg")!
// }))

// createEffect(() => {
//     const joints = getJoints()
//     if (!joints) return
    
//     console.log(joints)

// }, [getJoints])