import { applyMixins } from "@lincode/utils"
import { Sprite as ThreeSprite, SpriteMaterial } from "three"
import ISprite, { spriteDefaults, spriteSchema } from "../interface/ISprite"
import TexturedStandardMixin from "./core/mixins/TexturedStandardMixin"
import VisibleObjectManager from "./core/VisibleObjectManager"

const material = new SpriteMaterial({ transparent: true })

class Sprite extends VisibleObjectManager<ThreeSprite> implements ISprite {
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
    extends VisibleObjectManager<ThreeSprite>,
        TexturedStandardMixin {}
applyMixins(Sprite, [TexturedStandardMixin])
export default Sprite
