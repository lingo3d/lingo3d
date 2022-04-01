import { applyMixins } from "@lincode/utils"
import { Sprite as ThreeSprite, SpriteMaterial } from "three"
import ObjectManager from "./core/ObjectManager"
import TexturedBasicMixin from "./core/mixins/TexturedBasicMixin"
import ISprite, { spriteDefaults } from "../interface/ISprite"

class Sprite extends ObjectManager<ThreeSprite> implements ISprite {
    public static componentName = "sprite"
    public static defaults = spriteDefaults

    protected material: SpriteMaterial

    public constructor() {
        const material = new SpriteMaterial({ transparent: true })
        super(new ThreeSprite(material))
        this.material = material
    }

    public override dispose() {
        if (this.done) return this
        super.dispose()
        this.material.dispose()
        return this
    }
}
interface Sprite extends ObjectManager<ThreeSprite>, TexturedBasicMixin {}
applyMixins(Sprite, [TexturedBasicMixin])
export default Sprite