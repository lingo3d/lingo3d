import TexturedSpriteMixin from "../../display/core/mixins/TexturedSpriteMixin"
import {
    decreaseSpriteMaterial,
    increaseSpriteMaterial
} from "../../pools/spriteMaterialPool"
import renderSystemAutoClear from "../utils/renderSystemAutoClear"

export const [addRefreshTexturedSpriteSystem] = renderSystemAutoClear(
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
