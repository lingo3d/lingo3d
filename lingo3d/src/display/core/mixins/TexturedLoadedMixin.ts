import { Group, MeshStandardMaterial, MeshToonMaterial } from "three"
import Loaded from "../Loaded"

export default abstract class TexturedModelMixin extends Loaded<Group> {
    private _metalnessFactor?: number
    public get metalnessFactor() {
        return this._metalnessFactor ?? 1
    }
    public set metalnessFactor(val: number) {
        this._metalnessFactor = val
        this.loadedResolvable.then(loaded => {
            loaded.traverse((child: any) => {
                const mat = child.material
                if (!mat || !(mat instanceof MeshStandardMaterial)) return
                child.material.metalness = (child.userData.metalness ??= child.material.metalness ?? 0) * val
            })
        })
    }

    private _roughnessFactor?: number
    public get roughnessFactor() {
        return this._roughnessFactor ?? 1
    }
    public set roughnessFactor(val: number) {
        this._roughnessFactor = val
        this.loadedResolvable.then(loaded => {
            loaded.traverse((child: any) => {
                const mat = child.material
                if (!mat || !(mat instanceof MeshStandardMaterial)) return
                child.material.roughness = (child.userData.roughness ??= child.material.roughness ?? 0) * val
            })
        })
    }
    
    private _toon?: boolean
    public get toon() {
        return this._toon ?? false
    }
    public set toon(val: boolean) {
        this._toon = val
        this.loadedResolvable.then(loaded => {
            loaded.traverse((child: any) => {
                const mat = child.material
                if (!mat) return
                if (!(mat instanceof MeshToonMaterial)) {
                    child.material = new MeshToonMaterial()
                    child.material.copy(mat)
                }
                // (child.material as MeshToonMaterial).gradientMap = new 
            })
        })
    }
}