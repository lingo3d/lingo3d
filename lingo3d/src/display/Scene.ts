import Loaded from "./core/Loaded"
import deserialize from "./utils/deserialize"
import { SceneGraphNode, SetupNode } from "./utils/deserialize/types"
import fitContent from "./utils/fitContent"
import loadJSON from "./utils/loaders/loadJSON"
import { Group } from "three"
import applySetup from "./utils/deserialize/applySetup"
import { Resolvable } from "@lincode/promiselikes"
import IScene from "../interface/IScene"

export default class Scene extends Loaded<Record<string, any> | Array<any>> implements IScene {
    protected load = loadJSON

    private setupNode?: SetupNode

    public applySetup() {
        this.setupNode && applySetup(this.setupNode)
    }

    protected resolveLoaded(data: Array<SceneGraphNode>) {
        for (const node of data)
            if (node.type === "setup") {
                this.setupNode = node
                break
            }
        const loadedObject3d = new Group()
        const loadedResolvables: Array<Resolvable> = []
        const parts = this.src?.split("/")
        parts?.pop()
        for (const item of deserialize(data, parts?.join("/"), !this.visible, loadedResolvables))
            item && loadedObject3d.add(item.outerObject3d)
        
        this.loadedGroup.add(loadedObject3d)
        fitContent(this)

        Promise.all(loadedResolvables).then(() => this.loadedResolvable.resolve(loadedObject3d))
    }
}