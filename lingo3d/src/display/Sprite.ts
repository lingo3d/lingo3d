import { applyMixins } from "@lincode/utils"
import { Sprite as ThreeSprite, SpriteMaterial } from "three"
import ObjectManager from "./core/ObjectManager"
import TexturedBasicMixin from "./core/mixins/TexturedBasicMixin"
import ISprite, { spriteDefaults, spriteSchema } from "../interface/ISprite"

const material = new SpriteMaterial({ transparent: true })

class Sprite extends ObjectManager<ThreeSprite> implements ISprite {
    public static componentName = "sprite"
    public static defaults = spriteDefaults
    public static schema = spriteSchema

    public constructor() {
        super(new ThreeSprite(material))
    }

    public override get depth() {
        return 0
    }
    public override set depth(_) {}
    public override get scaleZ() {
        return 0
    }
    public override set scaleZ(_) {}
}
interface Sprite extends ObjectManager<ThreeSprite>, TexturedBasicMixin {}
applyMixins(Sprite, [TexturedBasicMixin])
export default Sprite
