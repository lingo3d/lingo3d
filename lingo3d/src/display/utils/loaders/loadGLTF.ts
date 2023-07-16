import { GLTFLoader } from "./loaders/GLTFLoader"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { forceGet, lazy } from "@lincode/utils"
import cloneSkinnedMesh from "../cloneSkinnedMesh"
import { handleProgress } from "./utils/bytesLoaded"
import processChildren from "./utils/processChildren"
import { wasmUrlPtr } from "../../../pointers/assetsPathPointers"
import { createUnloadMap } from "../../../utils/createUnloadMap"
import {
    addBusyProcess,
    deleteBusyProcess
} from "../../../collections/busyProcesses"

type Result = [GLTF, boolean, boolean]

const cache = createUnloadMap<string, Promise<Result>>()
const loader = new GLTFLoader()

const createDracoLoader = lazy(() => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(wasmUrlPtr[0])
    loader.setDRACOLoader(dracoLoader)
})

export default async (url: string, clone: boolean) => {
    createDracoLoader()
    const [gltf, noBone, noMesh] = await forceGet(
        cache,
        url,
        () =>
            new Promise<Result>((resolve, reject) => {
                addBusyProcess("loadGLTF")
                loader.load(
                    url,
                    (gltf: GLTF) => {
                        const noBonePtr: [boolean] = [true]
                        const noMeshPtr: [boolean] = [true]
                        for (const scene of gltf.scenes)
                            processChildren(scene, noBonePtr, noMeshPtr)

                        deleteBusyProcess("loadGLTF")
                        resolve([gltf, noBonePtr[0], noMeshPtr[0]])
                    },
                    handleProgress(url),
                    () => {
                        deleteBusyProcess("loadGLTF")
                        reject()
                    }
                )
            })
    )
    if (clone)
        return cloneSkinnedMesh(gltf.scene, noBone, noMesh, gltf.animations)

    return gltf.scene
}
