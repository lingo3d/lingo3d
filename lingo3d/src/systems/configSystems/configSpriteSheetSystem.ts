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
    addSpriteSheetPlaySystem,
    deleteSpriteSheetPlaySystem
} from "../spriteSheetPlaySystem"
import configSystemWithCleanUp from "../utils/configSystemWithCleanUp"

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
    loop: boolean | undefined
) => {
    material.visible = true
    const rows = Math.ceil(length / columns)
    addSpriteSheetPlaySystem(material, {
        x: 0,
        y: rows - 1,
        columns,
        rows,
        frame: 0,
        length,
        loop
    })
}

export const [addConfigSpriteSheetSystem] = configSystemWithCleanUp(
    (self: SpriteSheet) => {
        const {
            textureStart,
            textureEnd,
            texture,
            columns,
            length,
            loop,
            $material
        } = self
        if (textureStart && textureEnd) {
            const handle = new Cancellable()
            const params: SpriteSheetParams = [textureStart, textureEnd]
            const paramString = JSON.stringify(params)
            increaseSpriteSheet(params, paramString).then(
                ([url, columns, length, blob]) => {
                    if (handle.done) return
                    self.blob = blob
                    loadSpriteSheet($material, url, columns, length)
                    playSpriteSheet($material, columns, length, loop)
                }
            )
            return () => {
                decreaseSpriteSheet(paramString)
                deleteSpriteSheetPlaySystem($material)
                handle.cancel()
            }
        }
        if (!texture || !columns || !length) return

        const handle = new Cancellable()
        loadSpriteSheet($material, texture, columns, length)
        const timeout = setTimeout(
            () => playSpriteSheet($material, columns, length, loop),
            300
        )
        return () => {
            clearTimeout(timeout)
            deleteSpriteSheetPlaySystem($material)
            handle.cancel()
        }
    }
)
