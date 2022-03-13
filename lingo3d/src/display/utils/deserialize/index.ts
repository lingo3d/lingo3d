import { omit } from "@lincode/utils"
import createObject from "./createObject"
import { nonSerializedProperties, SceneGraphNode } from "./types"
import applySetup from "./applySetup"
import loadCubeTexture from "../loaders/loadCubeTexture"
import loadTextureAsync from "../loaders/loadTextureAsync"
import loadTexture from "../loaders/loadTexture"
import { Resolvable } from "@lincode/promiselikes"

const nodeToObjectManager = (
    node: SceneGraphNode,
    baseURL: string | undefined,
    noSetup: boolean | undefined,
    loadedResolvables: Array<Resolvable> | undefined
) => {
    if (baseURL) {
        if ("src" in node)
            node.src = baseURL + "/" + node.src
        if ("texture" in node)
            node.texture = baseURL + "/" + node.texture
        if ("skybox" in node)
            node.skybox = baseURL + "/" + node.skybox
    }

    if (node.type === "setup") {
        if (noSetup) {
            if (node.skybox) {
                if (Array.isArray(node.skybox))
                    loadCubeTexture(node.skybox)
                else
                    loadTextureAsync(node.skybox)
            }
            else if (node.texture)
                loadTexture(node.texture)
        }
        else applySetup(node)
        return
    }
    if (node.type === "animation") return

    const object = createObject(node.type)
    //@ts-ignore
    loadedResolvables && "loadedResolvable" in object && loadedResolvables.push(object.loadedResolvable)
    Object.assign(object, omit(node, nonSerializedProperties))
    node.name && (object.outerObject3d.name = node.name)
    node.children?.map(n => nodeToObjectManager(n, baseURL, noSetup, loadedResolvables)).forEach(c => c && object.append(c))
    return object
}

export default (graph: Array<SceneGraphNode>, baseURL?: string, skipSetup?: boolean, loadedResolvables?: Array<Resolvable>) => (
    graph.map(n => nodeToObjectManager(n, baseURL, skipSetup, loadedResolvables))
)