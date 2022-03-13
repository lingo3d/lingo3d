import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { LinearEncoding } from "three"
import { forceGet } from "@lincode/utils"
import cloneSkinnedMesh from "../cloneSkinnedMesh"
import { decreaseLoadingCount, increaseLoadingCount } from "../../../states/useLoadingCount"
import { settings } from "../../.."

const cache = new Map<string, Promise<GLTF>>()
const loader = new GLTFLoader()

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath(settings.wasmPath)
loader.setDRACOLoader(dracoLoader)

export default async (url: string) => {
    const gltf = await forceGet(cache, url, () => new Promise<GLTF>((resolve, reject) => {
        increaseLoadingCount()
        loader.load(url, gltf => {
            decreaseLoadingCount()
    
            for (const scene of gltf.scenes)
                scene.traverse((child: any) => {
                    child.material?.map && (child.material.map.encoding = LinearEncoding)
                    // child.castShadow = true
                    // child.receiveShadow = true
                })
            resolve(gltf)
        },
        undefined,
        () => {
            decreaseLoadingCount()
            reject()
        })
    }))
    return cloneSkinnedMesh(gltf.scene, gltf.animations)
}