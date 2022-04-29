import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { LinearEncoding, sRGBEncoding } from "three"
import { forceGet } from "@lincode/utils"
import cloneSkinnedMesh from "../cloneSkinnedMesh"
import { decreaseLoadingCount, increaseLoadingCount } from "../../../states/useLoadingCount"
import settings from "../../../api/settings"
import { handleProgress } from "./bytesLoaded"
import { getEncoding } from "../../../states/useEncoding"

const cache = new Map<string, Promise<GLTF>>()
const loader = new GLTFLoader()

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath(settings.wasmPath)
loader.setDRACOLoader(dracoLoader)

export default async (url: string, clone: boolean) => {
    const gltf = await forceGet(cache, url, () => new Promise<GLTF>((resolve, reject) => {
        increaseLoadingCount()
        loader.load(url, gltf => {
            decreaseLoadingCount()
    
            for (const scene of gltf.scenes)
                getEncoding() === "linear"
                    ? scene.traverse((child: any) => {
                        child.material?.map && (child.material.map.encoding = LinearEncoding)
                        // child.castShadow = true
                        // child.receiveShadow = true
                    })
                    : scene.traverse((child: any) => {
                        child.material?.map && (child.material.map.encoding = sRGBEncoding)
                        // child.castShadow = true
                        // child.receiveShadow = true
                    })
            resolve(gltf)
        },
        handleProgress,
        () => {
            decreaseLoadingCount()
            reject()
        })
    }))
    if (clone)
        return cloneSkinnedMesh(gltf.scene, gltf.animations)

    return gltf.scene
}