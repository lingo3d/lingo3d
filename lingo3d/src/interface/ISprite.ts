import IObjectManager, { objectManagerDefaults, objectManagerSchema } from "./IObjectManager"
import ITexturedBasic, { texturedBasicDefaults, texturedBasicSchema } from "./ITexturedBasic"
import Defaults from "./utils/Defaults"
import { ExtractProps } from "./utils/extractProps"

export default interface ISprite extends IObjectManager, ITexturedBasic {}

export const spriteSchema: Required<ExtractProps<ISprite>> = {
    ...objectManagerSchema,
    ...texturedBasicSchema
}

export const spriteDefaults: Defaults<ISprite> = {
    ...objectManagerDefaults,
    ...texturedBasicDefaults,
    scaleZ: 0,
    depth: 0
}