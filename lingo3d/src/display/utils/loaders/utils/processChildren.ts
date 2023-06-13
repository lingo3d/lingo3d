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
import { rad2Deg } from "@lincode/math"
import { blackColor } from "../../reusables"
import { castBackBlending } from "../../castBlending"

export default (group: Object3D, noBonePtr: [boolean]) => {
    const lights: Array<Light> = []
    group.traverse((child: Object3D | Mesh | Light | Bone) => {
        if ("isLight" in child) lights.push(child)
        else if (noBonePtr[0] && "isBone" in child) noBonePtr[0] = false

        if (!("material" in child)) return
        if (Array.isArray(child.material)) child.material = child.material[0]

        const material = child.material as MeshStandardMaterial
        material.side = DoubleSide
        uuidMaterialMap.set(material.uuid, material)
        materialDefaultsMap.set(material, {
            color: "#" + (material.color?.getHexString() ?? "ffffff"),
            opacity: material.opacity,
            texture: "",
            alphaMap: "",
            textureRepeat: material.map?.repeat.x ?? 1,
            textureFlipY: material.map?.flipY ?? false,
            textureRotation: (material.map?.rotation ?? 0) * rad2Deg,
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
        child.receiveShadow = true
    })
    for (const light of lights) light.parent!.remove(light)
}
