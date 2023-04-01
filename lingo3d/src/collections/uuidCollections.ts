import { Texture } from "three"
import Appendable from "../api/core/Appendable"
import MeshAppendable from "../api/core/MeshAppendable"

export const uuidMap = new Map<string, Appendable | MeshAppendable>()
export const uuidTextureMap = new Map<string, Texture>()
