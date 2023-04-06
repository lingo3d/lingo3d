import { Object3D } from "three"
import Appendable from "../api/core/Appendable"

export const selectionCandidates = new Set<Object3D>()
export const unselectableSet = new WeakSet<Appendable>()
