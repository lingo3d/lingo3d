import { Group as ThreeGroup } from "three"
import IGroup, { groupDefaults } from "../interface/IGroup"
import ObjectManager from "./core/ObjectManager"
import fitContent from "./utils/fitContent"

export default class Group extends ObjectManager<ThreeGroup> implements IGroup {
    public static componentName = "group"
    public static defaults = groupDefaults

    public constructor() {
        super(new ThreeGroup())
    }

    public override append(target: ObjectManager) {
        super.append(target)
        fitContent(this)
    }

    public override attach(target: ObjectManager) {
        super.attach(target)
        fitContent(this)
    }
}