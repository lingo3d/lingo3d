import { assert, forceGet, forceGetInstance, random } from "@lincode/utils"
import { Object3D } from "three"
import Appendable from "../api/core/Appendable"
import MeshAppendable from "../api/core/MeshAppendable"
import deserialize from "../api/serializer/deserialize"
import settings from "../api/settings"
import spawn from "../api/spawn"
import Dummy from "../display/Dummy"
import Group from "../display/Group"
import Model from "../display/Model"
import mainCamera from "../engine/mainCamera"

// const dummy = new Dummy()
// dummy.roughnessFactor = 0.4
// dummy.metalnessFactor = 1.5
// dummy.envFactor = 1.5
// dummy.scale = 5

// settings.environment = "studio"
// settings.defaultLight = false

settings.skybox = "day"
settings.ssr = true
