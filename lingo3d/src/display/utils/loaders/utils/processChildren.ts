import {
    Light,
    Bone,
    Object3D,
    Mesh,
    DoubleSide,
    MeshStandardMaterial
} from "three"
import { uuidMaterialMap } from "../../../../collections/idCollections"
import { materialDefaultsMap } from "../../../../collections/materialDefaultsMap"
import { blackColor } from "../../reusables"
import { castBackBlending } from "../../castBlending"
import isOpaque from "../../../../memo/isOpaque"
import { RAD2DEG } from "three/src/math/MathUtils"
import { csmMaterialSet } from "../../../../collections/csmMaterialSet"

export default (group: Object3D) => {
    const lights: Array<Light> = []
    let noBone = true
    let noMesh = true
    group.traverse((child: Object3D | Mesh | Light | Bone) => {
        if ("isLight" in child) lights.push(child)
        else if (noBone && "isBone" in child) noBone = false
        else if (noMesh && "isMesh" in child) noMesh = false

        if (!("material" in child)) return
        if (Array.isArray(child.material)) child.material = child.material[0]

        const material = child.material as MeshStandardMaterial
        csmMaterialSet.add(material)
        material.side = DoubleSide
        uuidMaterialMap.set(material.uuid, material)
        materialDefaultsMap.set(material, {
            color: "#" + (material.color?.getHexString() ?? "ffffff"),
            opacity: material.opacity,
            texture: "",
            alphaMap: "",
            textureRepeat: material.map?.repeat.x ?? 1,
            textureFlipY: material.map?.flipY ?? false,
            textureRotation: (material.map?.rotation ?? 0) * RAD2DEG,
            wireframe: material.wireframe,
            envMap: "",
            envMapIntensity: material.envMapIntensity,
            aoMap: "",
            aoMapIntensity: material.aoMapIntensity,
            bumpMap: "",
            bumpScale: material.bumpScale,
            displacementMap: "",
            displacementScale: material.displacementScale,
            displacementBias: material.displacementBias,
            emissive: material.emissive
                ? !material.emissive.equals(blackColor)
                : false,
            emissiveIntensity: material.emissiveIntensity,
            lightMap: "",
            lightMapIntensity: material.lightMapIntensity,
            metalnessMap: "",
            metalness: material.metalness,
            roughnessMap: "",
            roughness: material.roughness,
            normalMap: "",
            normalScale: material.normalScale?.x ?? 1,
            depthTest: material.depthTest,
            blending: castBackBlending(material.blending),
            referenceUUID: material.uuid
        })
        child.castShadow = isOpaque(child)
        child.receiveShadow = true
    })
    for (const light of lights) light.parent!.remove(light)
    return [noBone, noMesh]
}
