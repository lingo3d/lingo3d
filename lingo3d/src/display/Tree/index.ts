import ITree, { treeDefaults, treeSchema } from "../../interface/ITree"
import Model from "../Model"

const url = "https://unpkg.com/lingo3d-forest@1.0.0/assets/"

export default class Tree extends Model implements ITree {
    public static override componentName = "tree"
    public static override defaults = treeDefaults
    public static override schema = treeSchema

    public constructor() {
        super()
        this.scale = 4
        this.preset = "tree1"
    }

    private _preset = ""
    public get preset() {
        return this._preset
    }
    public set preset(val) {
        this.src = url + val + ".glb"
    }
}
