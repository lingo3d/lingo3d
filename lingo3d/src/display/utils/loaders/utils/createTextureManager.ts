import { rad2Deg } from "@lincode/math"
import { MeshStandardMaterial } from "three"
import {
    ReferenceMaterialParams,
    allocateDefaultReferenceMaterial
} from "../../../../pools/referenceMaterialPool"
import TextureManager from "../../../core/TextureManager"
import { blackColor } from "../../reusables"
import { addRefreshTexturedReferenceSystem } from "../../../../systems/configSystems/refreshTexturedReferenceSystem"

const makeDefaults = (referenceMaterial: MeshStandardMaterial) => {
    const defaults = {
        color: "#" + (referenceMaterial.color?.getHexString() ?? "ffffff"),
        opacity: referenceMaterial.opacity,
        texture: "",
        alphaMap: "",
        textureRepeat: referenceMaterial.map?.repeat ?? { x: 1, y: 1 },
        textureFlipY: referenceMaterial.map?.flipY ?? false,
        textureRotation: (referenceMaterial.map?.rotation ?? 0) * rad2Deg,
        wireframe: referenceMaterial.wireframe,
        envMap: "",
        envMapIntensity: referenceMaterial.envMapIntensity,
        aoMap: "",
        aoMapIntensity: referenceMaterial.aoMapIntensity,
        bumpMap: "",
        bumpScale: referenceMaterial.bumpScale,
        displacementMap: "",
        displacementScale: referenceMaterial.displacementScale,
        displacementBias: referenceMaterial.displacementBias,
        emissive: referenceMaterial.emissive
            ? !referenceMaterial.emissive.equals(blackColor)
            : false,
        emissiveIntensity: referenceMaterial.emissiveIntensity,
        lightMap: "",
        lightMapIntensity: referenceMaterial.lightMapIntensity,
        metalnessMap: "",
        metalness: referenceMaterial.metalness,
        roughnessMap: "",
        roughness: referenceMaterial.roughness,
        normalMap: "",
        normalScale: referenceMaterial.normalScale?.x ?? 1,
        depthTest: referenceMaterial.depthTest,
        uuid: referenceMaterial.uuid
    }
    const defaultParams = Object.values(defaults) as ReferenceMaterialParams
    return <const>[defaults, defaultParams]
}

export default (referenceMaterial: MeshStandardMaterial) => {
    const [defaults, defaultParams] = makeDefaults(referenceMaterial)
    allocateDefaultReferenceMaterial(defaultParams, referenceMaterial)

    const addRefreshParamsSystem = (target: TextureManager) =>
        addRefreshTexturedReferenceSystem(target, {
            referenceMaterial,
            defaults,
            MyTextureManager
        })

    class MyTextureManager extends TextureManager {
        public override defaults = defaults
        public override defaultParams = defaultParams
        public override addRefreshParamsSystem = addRefreshParamsSystem

        public static override defaults = defaults
        public static override defaultParams = defaultParams
        public static override addRefreshParamsSystem = addRefreshParamsSystem
    }

    return MyTextureManager
}
