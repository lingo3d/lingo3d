import { EDITOR_URL } from "../../../globals"
import Sprite from "../../Sprite"

export default () => {
    const sprite = new Sprite()
    sprite.texture = `${EDITOR_URL}lightSprite.png`
    sprite.scale = 0.5
    return sprite
}
