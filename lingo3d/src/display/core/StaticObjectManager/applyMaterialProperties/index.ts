import { debounce } from "@lincode/utils"
import { Group, MeshToonMaterial, MeshStandardMaterial } from "three"
import StaticObjectManager from ".."
import Loaded from "../../Loaded"
import copyStandard from "./copyStandard"
import copyToon from "./copyToon"

export const applySet = new Set<StaticObjectManager | Loaded<Group>>()

const getDefault = (child: any, property: string) => (
    child.userData[property] ??= (child.material[property] ?? 1)
)
const setValue = (child: any, property: string, factor: number) => {
    child.material[property] = getDefault(child, property) * factor
}

const processChild = (
    child: any,
    _toon?: boolean,
    _pbr?: boolean,
    _metalnessFactor?: number,
    _roughnessFactor?: number,
    _opacityFactor?: number
) => {
    const { material } = child
    if (!material) return

    if (Array.isArray(material)) {
        if (_toon) {
            for (let i = 0; i < material.length; ++i) {
                const m = material[i]
                const mat = material[i] = new MeshToonMaterial()
                copyToon(m, mat)
                m.dispose()
            }
        }
        else if (_pbr)
            for (let i = 0; i < material.length; ++i) {
                const m = material[i]
                const mat = material[i] = new MeshStandardMaterial()
                copyStandard(m, mat)
                mat.envMapIntensity = 1
                mat.roughness = 1
                mat.metalness = 1
                m.dispose()
            }
        return
    }

    if (_toon) {
        child.material = new MeshToonMaterial()
        copyToon(material, child.material)
        material.dispose()
    }
    else if (_pbr) {
        child.material = new MeshStandardMaterial()
        copyStandard(material, child.material)
        child.material.envMapIntensity = 1
        child.material.roughness = 1
        child.material.metalness = 1
        material.dispose()
    }
    
    if (child.material instanceof MeshStandardMaterial) {
        _metalnessFactor !== undefined && setValue(child, "metalness", _metalnessFactor)
        _roughnessFactor !== undefined && setValue(child, "roughness", _roughnessFactor)
    }
    if (_opacityFactor !== undefined) {
        setValue(child, "opacity", _opacityFactor)
        child.material.transparent = _opacityFactor < 1
    }
}

export default debounce(() => {
    for (const model of applySet) {
        //@ts-ignore
        const { _toon, _pbr, _metalnessFactor = 0, _roughnessFactor, _opacityFactor } = model

        if ("loadedResolvable" in model)
            model.loadedResolvable.then(loaded => {
                loaded.traverse(child => processChild(
                    child, _toon, _pbr, _metalnessFactor, _roughnessFactor, _opacityFactor
                ))
            })
        else
            model.outerObject3d.traverse(child => processChild(
                child, _toon, _pbr, _metalnessFactor, _roughnessFactor, _opacityFactor
            ))
    }
    applySet.clear()    

}, 0, "trailing")