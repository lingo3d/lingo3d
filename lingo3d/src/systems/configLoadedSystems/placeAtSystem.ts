import MeshAppendable from "../../display/core/MeshAppendable"
import { getAppendablesById } from "../../collections/idCollections"
import SpawnPoint from "../../display/SpawnPoint"
import { point2Vec } from "../../display/utils/vec2Point"
import { Point3dType } from "../../utils/isPoint"
import getActualScale from "../../memo/getActualScale"
import getCenter from "../../memo/getCenter"
import getWorldQuaternion from "../../memo/getWorldQuaternion"
import configLoadedSystemWithData from "../utils/configLoadedSystemWithData"
import { configPhysicsSystem } from "./configPhysicsSystem"

type Data = { target: MeshAppendable | Point3dType | SpawnPoint | string }

export const [addPlaceAtSystem] = configLoadedSystemWithData(
    (self: MeshAppendable, { target }: Data) => {
        if (typeof target === "string") {
            const [found] = getAppendablesById(target)
            if (!("outerObject3d" in found)) return
            target = found
        }
        if ("outerObject3d" in target) {
            if ("isSpawnPoint" in target)
                target.object3d.position.y = getActualScale(self).y * 0.5
            self.position.copy(getCenter(target.object3d))
            "quaternion" in self &&
                self.quaternion.copy(getWorldQuaternion(target.outerObject3d))
        } else self.position.copy(point2Vec(target))
        configPhysicsSystem.add(self)
    }
)
