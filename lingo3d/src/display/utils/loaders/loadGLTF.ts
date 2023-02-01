import { GLTFLoader } from "./loaders/GLTFLoader"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { forceGet } from "@lincode/utils"
import cloneSkinnedMesh from "../cloneSkinnedMesh"
import { handleProgress } from "./utils/bytesLoaded"
import { getAssetsPath } from "../../../states/useAssetsPath"
import {
    decreaseLoadingUnpkgCount,
    increaseLoadingUnpkgCount
} from "../../../states/useLoadingUnpkgCount"
import processChildren from "./utils/processChildren"

const cache = new Map<string, Promise<[GLTF, boolean]>>()
const loader = new GLTFLoader()

const dracoLoader = new DRACOLoader()
getAssetsPath((wasmPath) => dracoLoader.setDecoderPath(wasmPath))
loader.setDRACOLoader(dracoLoader)

export default async (url: string, clone: boolean) => {
    const [gltf, noBone] = await forceGet(
        cache,
        url,
        () =>
            new Promise<[GLTF, boolean]>((resolve, reject) => {
                const unpkg = url.startsWith("https://unpkg.com/")
                unpkg && increaseLoadingUnpkgCount()
                loader.load(
                    url,
                    (gltf: GLTF) => {
                        const noBonePtr: [boolean] = [true]
                        for (const scene of gltf.scenes)
                            processChildren(scene, noBonePtr)

                        unpkg && decreaseLoadingUnpkgCount()
                        resolve([gltf, noBonePtr[0]])
                    },
                    handleProgress(url),
                    reject
                )
            })
    )
    if (clone) return cloneSkinnedMesh(gltf.scene, noBone, gltf.animations)

    return gltf.scene
}
