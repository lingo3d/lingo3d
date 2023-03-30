import TexturedSpriteMixin from "../../display/core/mixins/TexturedSpriteMixin"
import {
    decreaseSpriteMaterial,
    increaseSpriteMaterial
} from "../../pools/spriteMaterialPool"
import configSystem from "../utils/configSystem"

export const [addRefreshTexturedSpriteSystem] = configSystem(
    (target: TexturedSpriteMixin) => {
        if (target.materialParamString)
            decreaseSpriteMaterial(target.materialParamString)
        else
            target.then(() =>
                decreaseSpriteMaterial(target.materialParamString!)
            )
        const paramString = JSON.stringify(target.materialParams)
        target.material = increaseSpriteMaterial(
            target.materialParams,
            paramString
        )
        target.materialParamString = paramString
    }
)
