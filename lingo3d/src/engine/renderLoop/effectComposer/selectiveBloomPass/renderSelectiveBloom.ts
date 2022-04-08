import { Object3D } from "three"
import scene from "../../../scene"
import selectiveBloomComposer from "./selectiveBloomComposer"

export const bloomPtr = [false]

export const addBloom = (target: Object3D) => {
    target.userData.bloom = true
    bloomPtr[0] = true
}

export const deleteBloom = (target: Object3D) => {
    target.userData.bloom = false
}

let sceneBackground: typeof scene.background | undefined

const darkenRecursive = (children: Array<any>) => {
    for (const child of children) {
        if (child.userData.bloom) {
            child.renderOrder = 1
            continue
        }
        if (!child.visible) continue

        darkenRecursive(child.children)
        child.material && (child.material.colorWrite = false)
        child.renderOrder = 0
    }
}
const darken = () => {
    darkenRecursive(scene.children)

    if (scene.background) {
        sceneBackground = scene.background
        scene.background = null
    }
}

const restoreRecursive = (child: any) => child.material && (child.material.colorWrite = true)
const restore = () => {
    scene.traverse(restoreRecursive)
    sceneBackground && (scene.background = sceneBackground)
}

export default () => {
    darken()
    selectiveBloomComposer.render()
    restore()
}