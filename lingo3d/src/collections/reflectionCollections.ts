import { Cancellable } from "@lincode/promiselikes"
import { Texture } from "three"
import MeshAppendable from "../display/core/MeshAppendable"
import Model from "../display/Model"

export const reflectionVisibleSet = new Set<MeshAppendable>()
export const reflectionChangedSet = new WeakSet<Model>()
export const reflectionDataMap = new WeakMap<Model, [Texture, Cancellable]>()
