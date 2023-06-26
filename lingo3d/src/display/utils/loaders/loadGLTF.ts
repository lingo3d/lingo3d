import { GLTFLoader } from "./loaders/GLTFLoader"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { forceGet, lazy } from "@lincode/utils"
import cloneSkinnedMesh from "../cloneSkinnedMesh"
import { handleProgress } from "./utils/bytesLoaded"
import processChildren from "./utils/processChildren"
import { wasmUrlPtr } from "../../../pointers/assetsPathPointers"
import { busyCountPtr } from "../../../pointers/busyCountPtr"

const cache = new Map<string, Promise<[GLTF, boolean]>>()
const loader = new GLTFLoader()

const createDracoLoader = lazy(() => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(wasmUrlPtr[0])
    loader.setDRACOLoader(dracoLoader)
})

export default async (url: string, clone: boolean) => {
    createDracoLoader()
    const [gltf, noBone] = await forceGet(
        cache,
        url,
        () =>
            new Promise<[GLTF, boolean]>((resolve, reject) => {
                busyCountPtr[0]++
                loader.load(
                    url,
                    (gltf: GLTF) => {
                        const noBonePtr: [boolean] = [true]
                        for (const scene of gltf.scenes)
                            processChildren(scene, noBonePtr)

                        busyCountPtr[0]--
                        resolve([gltf, noBonePtr[0]])
                    },
                    handleProgress(url),
                    () => {
                        busyCountPtr[0]--
                        reject()
                    }
                )
            })
    )
    if (clone) return cloneSkinnedMesh(gltf.scene, noBone, gltf.animations)

    return gltf.scene
}
