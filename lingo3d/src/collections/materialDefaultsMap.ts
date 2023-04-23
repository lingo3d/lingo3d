import { MeshStandardMaterial } from "three"

export const materialDefaultsMap = new WeakMap<
    MeshStandardMaterial,
    Record<string, any>
>()
