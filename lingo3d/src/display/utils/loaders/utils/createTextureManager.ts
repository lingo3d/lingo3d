import { rad2Deg } from "@lincode/math"
import { MeshStandardMaterial } from "three"
import {
    allocateDefaultMaterial,
    decreaseMaterialCount,
    increaseMaterialCount
} from "../../../../pools/materialPool"
import { TexturedStandardParams } from "../../../../pools/texturedStandardPool"
import renderSystemAutoClear from "../../../../utils/renderSystemAutoClear"
import { StandardMesh } from "../../../core/mixins/TexturedStandardMixin"
import TextureManager from "../../../core/TextureManager"
import Model from "../../../Model"
import { blackColor } from "../../reusables"

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
        depthTest: referenceMaterial.depthTest
    }
    const defaultParams = Object.values(defaults) as TexturedStandardParams
    return <const>[defaults, defaultParams]
}

export default (referenceMaterial: MeshStandardMaterial) => {
    const [defaults, defaultParams] = makeDefaults(referenceMaterial)
    allocateDefaultMaterial(defaultParams, referenceMaterial)

    const [addRefreshParamsSystem] = renderSystemAutoClear(
        (target: MyTextureManager) => {
            if (target.materialParamString)
                decreaseMaterialCount(target.materialParamString)
            else
                target.owner.then(() =>
                    decreaseMaterialCount(target.materialParamString!)
                )
            const paramString = JSON.stringify(target.materialParams)
            target.material = increaseMaterialCount(
                target.materialParams,
                paramString,
                { referenceMaterial, defaults, MyTextureManager }
            )
            target.materialParamString = paramString
        }
    )

    class MyTextureManager extends TextureManager {
        public constructor(public object3d: StandardMesh, public owner: Model) {
            super()
        }

        public override defaults = defaults
        public override defaultParams = defaultParams
        public override addRefreshParamsSystem = addRefreshParamsSystem

        public static override defaults = defaults
        public static override defaultParams = defaultParams
        public static override addRefreshParamsSystem = addRefreshParamsSystem
    }

    return MyTextureManager
}
