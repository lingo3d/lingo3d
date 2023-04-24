import MeshAppendable from "../../api/core/MeshAppendable"
import { getAppendablesById } from "../../collections/uuidCollections"
import SpawnPoint from "../../display/SpawnPoint"
import { point2Vec } from "../../display/utils/vec2Point"
import { Point3dType } from "../../utils/isPoint"
import getActualScale from "../../utilsCached/getActualScale"
import getCenter from "../../utilsCached/getCenter"
import getWorldQuaternion from "../../utilsCached/getWorldQuaternion"
import { addConfigPhysicsSystem } from "./configPhysicsSystem"
import configLoadedSystemWithData from "../utils/configLoadedSystemWithData"

type Data = { target: MeshAppendable | Point3dType | SpawnPoint | string }

export const [addPlaceAtSystem] = configLoadedSystemWithData(
    (self, { target }: Data) => {
        if (typeof target === "string") {
            const [found] = getAppendablesById(target)
            if (!(found instanceof MeshAppendable)) return
            target = found
        }
        if ("outerObject3d" in target) {
            if ("isSpawnPoint" in target)
                target.object3d.position.y = getActualScale(self).y * 0.5
            self.position.copy(getCenter(target.object3d))
            "quaternion" in self &&
                self.quaternion.copy(getWorldQuaternion(target.outerObject3d))
        } else self.position.copy(point2Vec(target))
        addConfigPhysicsSystem(self)
    }
)
