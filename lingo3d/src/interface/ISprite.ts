import IObjectManager, { objectManagerDefaults } from "./IObjectManager"
import ITexturedBasic, { texturedBasicDefaults } from "./ITexturedBasic"

export default interface ISprite extends IObjectManager, ITexturedBasic {}

export const spriteDefaults: ISprite = {
    ...objectManagerDefaults,
    ...texturedBasicDefaults
}