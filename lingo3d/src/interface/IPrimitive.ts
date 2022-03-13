import IObjectManager from "./IObjectManager"
import ITexturedBasic from "./ITexturedBasic"
import ITexturedStandard from "./ITexturedStandard"

export default interface IPrimitive extends IObjectManager, ITexturedBasic, ITexturedStandard {}