import { Group as ThreeGroup } from "three"
import IGroup, { groupDefaults, groupSchema } from "../interface/IGroup"
import VisibleObjectManager from "./core/VisibleObjectManager"

export default class Group
    extends VisibleObjectManager<ThreeGroup>
    implements IGroup
{
    public static componentName = "group"
    public static defaults = groupDefaults
    public static schema = groupSchema

    public constructor() {
        super(new ThreeGroup())
    }
}
