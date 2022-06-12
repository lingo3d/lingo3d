import Model from "../display/Model"
import store, { createEffect } from "@lincode/reactivity"
import FoundManager from "../display/core/FoundManager"
import Bone from "../display/Bone"
import { vec2Point } from "../display/utils/vec2Point"
import { last } from "@lincode/utils"
import { vector3, vector3_ } from "../display/utils/reusables"
import { Bone as ThreeBone } from "three"
import createBones from "../display/utils/createBones"

export default {}

const player = new Model()
player.src = "person.glb"
player.x = 100

const bot = new Model()
bot.src = "bot.fbx"

createBones(bot)
createBones(player)