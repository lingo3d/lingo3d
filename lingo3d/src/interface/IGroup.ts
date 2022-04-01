import IObjectManager, { objectManagerDefaults } from "./IObjectManager"

export default interface IGroup extends IObjectManager {}

export const groupDefaults: IGroup = {
    ...objectManagerDefaults,
}