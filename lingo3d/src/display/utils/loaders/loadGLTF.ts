import { GLTFLoader } from "./loaders/GLTFLoader"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { forceGet, lazy } from "@lincode/utils"
import cloneSkinnedMesh from "../cloneSkinnedMesh"
import { handleProgress } from "./utils/bytesLoaded"
import {
    decreaseLoadingAssetsCount,
    increaseLoadingAssetsCount
} from "../../../states/useLoadingAssetsCount"
import processChildren from "./utils/processChildren"
import { WASM_URL } from "../../../api/assetsPath"
import { assetsPathPtr } from "../../../pointers/assetsPathPtr"

const cache = new Map<string, Promise<[GLTF, boolean]>>()
const loader = new GLTFLoader()

const createDracoLoader = lazy(() => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(WASM_URL())
    loader.setDRACOLoader(dracoLoader)
})

export default async (url: string, clone: boolean) => {
    createDracoLoader()
    const [gltf, noBone] = await forceGet(
        cache,
        url,
        () =>
            new Promise<[GLTF, boolean]>((resolve, reject) => {
                const isAssets = url.startsWith(assetsPathPtr[0])
                isAssets && increaseLoadingAssetsCount()
                loader.load(
                    url,
                    (gltf: GLTF) => {
                        const noBonePtr: [boolean] = [true]
                        for (const scene of gltf.scenes)
                            processChildren(scene, noBonePtr)

                        isAssets && decreaseLoadingAssetsCount()
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
