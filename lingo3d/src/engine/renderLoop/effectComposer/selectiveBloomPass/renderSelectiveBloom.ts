import { MeshBasicMaterial, MeshStandardMaterial, Object3D } from "three"
import { getSelectiveBloomComposer } from "../../../../states/useSelectiveBloomComposer"
import scene from "../../../scene"

export const bloomPtr = [false]

export const addBloom = (target: Object3D) => {
    target.userData.bloom = true
    bloomPtr[0] = true
}

export const deleteBloom = (target: Object3D) => {
    target.userData.bloom = false
}

let sceneBackground: typeof scene.background | undefined

const blackMaterial = new MeshBasicMaterial({ color: 0x000000 })
let restoreMaterials: Array<[MeshStandardMaterial, any]> = []

const darkenRecursive = (children: Array<any>) => {
    for (const child of children) {
        if (child.userData.bloom || !child.visible) continue

        darkenRecursive(child.children)
        if (child.material) {
            restoreMaterials.push([child.material, child])
            child.material = blackMaterial
        }
    }
}
const darken = () => {
    darkenRecursive(scene.children)

    if (scene.background) {
        sceneBackground = scene.background
        scene.background = null
    }
}

const restore = () => {
    for (const [material, object] of restoreMaterials)
        object.material = material

    restoreMaterials = []
    sceneBackground && (scene.background = sceneBackground)
}

export default () => {
    darken()
    getSelectiveBloomComposer()?.render()
    restore()
}
