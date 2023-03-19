import IGroup, { groupDefaults, groupSchema } from "../interface/IGroup"
import VisibleObjectManager from "./core/VisibleObjectManager"

export default class Group extends VisibleObjectManager implements IGroup {
    public static componentName = "group"
    public static defaults = groupDefaults
    public static schema = groupSchema
}
