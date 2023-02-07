import { applyMixins } from "@lincode/utils"
import { Sprite as ThreeSprite, SpriteMaterial } from "three"
import ISprite, { spriteDefaults, spriteSchema } from "../interface/ISprite"
import TexturedSpriteMixin from "./core/mixins/TexturedSpriteMixin"
import MixinType from "./core/mixins/utils/MixinType"
import PhysicsObjectManager from "./core/PhysicsObjectManager"

const material = new SpriteMaterial({ transparent: true })

class Sprite extends PhysicsObjectManager<ThreeSprite> implements ISprite {
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
interface Sprite
    extends PhysicsObjectManager<ThreeSprite>,
        MixinType<TexturedSpriteMixin> {}
applyMixins(Sprite, [TexturedSpriteMixin])
export default Sprite
