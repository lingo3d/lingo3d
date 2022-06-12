import Model from "../display/Model"
import store, { createEffect } from "@lincode/reactivity"
import FoundManager from "../display/core/FoundManager"
import Bone from "../display/Bone"
import { vec2Point } from "../display/utils/vec2Point"
import { last } from "@lincode/utils"
import { vector3, vector3_ } from "../display/utils/reusables"

export default {}

const player = new Model()
player.src = "person.glb"
player.x = 100

const bot = new Model()
bot.src = "bot.fbx"

const [setJoints, getJoints] = store<Record<string, FoundManager> | undefined>(undefined)
bot.loaded.then(() => setJoints({
    spine: bot.find("mixamorigSpine")!,
    rightUpLeg: bot.find("mixamorigRightUpLeg")!,
    rightLeg: bot.find("mixamorigRightLeg")!
}))

createEffect(() => {
    const joints = getJoints()
    if (!joints) return
    
    const { object3d } = joints.rightLeg
    const child = last(object3d.children)

    if (!child) return

    const from = object3d.getWorldPosition(vector3)
    const to = child.getWorldPosition(vector3_)

    const bone = new Bone()
    bone.from = vec2Point(from)
    bone.to = vec2Point(to)

}, [getJoints])