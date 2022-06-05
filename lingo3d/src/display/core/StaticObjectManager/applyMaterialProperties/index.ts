import { debounce } from "@lincode/utils"
import { Group, MeshToonMaterial, MeshStandardMaterial } from "three"
import StaticObjectManager from ".."
import Loaded from "../../Loaded"
import { ogMaterialMap } from "./copyMaterial"
import copyStandard from "./copyStandard"
import copyToon from "./copyToon"

export const applySet = new Set<StaticObjectManager | Loaded<Group>>()

const setNumber = (child: any, property: string, factor: number) => {
    const defaultValue = child.userData[property] ??= (child.material[property] ?? 1)
    child.material[property] = defaultValue * factor
}

const setBoolean = (child: any, property: string, value?: boolean) => {
    const defaultValue = child.userData[property] ??= child.material[property]
    child.material[property] = value !== undefined ? value : defaultValue
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
        else
            for (let i = 0; i < material.length; ++i) {
                const og = ogMaterialMap.get(material[i])
                og && (material[i] = og)
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
    else {
        const og = ogMaterialMap.get(child.material)
        if (og && child.material !== og) {
            child.material = og
            return
        }
    }
    
    if (child.material instanceof MeshStandardMaterial) {
        _metalnessFactor !== undefined && setNumber(child, "metalness", _metalnessFactor)
        _roughnessFactor !== undefined && setNumber(child, "roughness", _roughnessFactor)
    }
    if (_opacityFactor !== undefined) {
        setNumber(child, "opacity", _opacityFactor)
        setBoolean(child, "transparent", _opacityFactor < 1 ? true : undefined)
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