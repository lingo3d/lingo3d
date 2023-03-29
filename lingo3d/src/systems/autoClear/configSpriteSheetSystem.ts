import { Cancellable } from "@lincode/promiselikes"
import { SpriteMaterial } from "three"
import SpriteSheet from "../../display/SpriteSheet"
import loadTexture from "../../display/utils/loaders/loadTexture"
import {
    SpriteSheetParams,
    increaseSpriteSheet,
    decreaseSpriteSheet
} from "../../pools/spriteSheetPool"
import {
    addSpriteSheetSystem,
    deleteSpriteSheetSystem
} from "../spriteSheetSystem"
import renderSystemAutoClearWithCleanUp from "../utils/renderSystemAutoClearWithCleanUp"

const loadSpriteSheet = (
    material: SpriteMaterial,
    url: string,
    columns: number,
    length: number
) => {
    const map = (material.map = loadTexture(url, () => {
        const rows = Math.ceil(length / columns)
        map.repeat.set(1 / columns, 1 / rows)
    }))
    return map
}

const playSpriteSheet = (
    material: SpriteMaterial,
    columns: number,
    length: number,
    loop: boolean | undefined,
    handle: Cancellable
) => {
    material.visible = true
    const rows = Math.ceil(length / columns)
    addSpriteSheetSystem(material, {
        x: 0,
        y: rows - 1,
        columns,
        rows,
        frame: 0,
        length,
        loop
    })
    handle.then(() => deleteSpriteSheetSystem(material))
}

export const [addConfigSpriteSheetSystem, deleteConfigSpriteSheetSystem] =
    renderSystemAutoClearWithCleanUp((self: SpriteSheet) => {
        const {
            textureStart,
            textureEnd,
            texture,
            columns,
            length,
            loop,
            material
        } = self
        if (textureStart && textureEnd) {
            const handle = new Cancellable()
            const params: SpriteSheetParams = [textureStart, textureEnd]
            const paramString = JSON.stringify(params)
            increaseSpriteSheet(params, paramString).then(
                ([url, columns, length, blob]) => {
                    self.blob = blob
                    loadSpriteSheet(material, url, columns, length)
                    playSpriteSheet(material, columns, length, loop, handle)
                }
            )
            return () => {
                decreaseSpriteSheet(paramString)
                handle.cancel()
            }
        }
        if (!texture || !columns || !length) return

        const handle = new Cancellable()
        loadSpriteSheet(material, texture, columns, length)
        const timeout = setTimeout(() => {
            playSpriteSheet(material, columns, length, loop, handle)
        }, 300)
        return () => {
            clearTimeout(timeout)
            handle.cancel()
        }
    })
