import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { Bone, LinearEncoding } from "three"
import { forceGet } from "@lincode/utils"
import cloneSkinnedMesh from "../cloneSkinnedMesh"
import { decreaseLoadingCount, increaseLoadingCount } from "../../../states/useLoadingCount"
import { handleProgress } from "./bytesLoaded"
import { getWasmPath } from "../../../states/useWasmPath"

const cache = new Map<string, Promise<[GLTF, boolean]>>()
const loader = new GLTFLoader()

const dracoLoader = new DRACOLoader()
getWasmPath(wasmPath => dracoLoader.setDecoderPath(wasmPath))
loader.setDRACOLoader(dracoLoader)

export default async (url: string, clone: boolean) => {
    const [gltf, noBone] = await forceGet(cache, url, () => new Promise<[GLTF, boolean]>((resolve, reject) => {
        increaseLoadingCount()
        loader.load(url, gltf => {
            decreaseLoadingCount()
    
            let noBone = true
            for (const scene of gltf.scenes)
                scene.traverse((child: any) => {
                    noBone && child instanceof Bone && (noBone = false)

                    child.material?.map && (child.material.map.encoding = LinearEncoding)
                    // child.castShadow = true
                    // child.receiveShadow = true
                })
            resolve([gltf, noBone])
        },
        handleProgress,
        () => {
            decreaseLoadingCount()
            reject()
        })
    }))
    if (clone)
        return cloneSkinnedMesh(gltf.scene, noBone, gltf.animations)

    return gltf.scene
}