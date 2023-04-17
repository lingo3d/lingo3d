import { MeshStandardMaterial } from "three"
import TextureManager from "../../display/core/TextureManager"
import {
    decreaseReferenceMaterial,
    increaseReferenceMaterial,
    ReferenceMaterialParams
} from "../../pools/referenceMaterialPool"
import configSystemWithData from "../utils/configSystemWithData"
import { Class } from "@lincode/utils"

export const [addRefreshTexturedReferenceSystem] = configSystemWithData(
    (
        target: TextureManager,
        data: {
            referenceMaterial: MeshStandardMaterial
            defaults: Record<string, any>
            MyTextureManager: Class<TextureManager>
        }
    ) => {
        if (target.materialParamString)
            decreaseReferenceMaterial(target.materialParamString)
        else
            ((target as any).owner ?? target).then(() =>
                decreaseReferenceMaterial(target.materialParamString!)
            )
        const paramString = JSON.stringify(target.materialParams)
        target.material = increaseReferenceMaterial(
            target.materialParams as ReferenceMaterialParams,
            paramString,
            data
        )
        target.materialParamString = paramString
    }
)
