import { Cancellable } from "@lincode/promiselikes"
import { SpriteMaterial } from "three"
import SpriteSheet from "../../display/SpriteSheet"
import loadTexture from "../../display/utils/loaders/loadTexture"
import {
    requestSpriteSheet,
    releaseSpriteSheet
} from "../../pools/spriteSheetPool"
import { spriteSheetPlaybackSystem } from "../spriteSheetPlaySystem"
import createSystem from "../utils/createInternalSystem"

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
    spriteSheetPlaybackSystem.add(material, {
        x: 0,
        y: rows - 1,
        columns,
        rows,
        frame: 0,
        length,
        loop
    })
}

export const configSpriteSheetSystem = createSystem("configSpriteSheetSystem", {
    effect: (self: SpriteSheet) => {
        const {
            textureStart,
            textureEnd,
            texture,
            columns,
            length,
            loop,
            object3d: { material }
        } = self

        if (textureStart && textureEnd) {
            const handle = new Cancellable()
            const promise = requestSpriteSheet([textureStart, textureEnd])
            promise.then(([url, columns, length, blob]) => {
                if (handle.done) return
                self.$blob = blob
                loadSpriteSheet(material, url, columns, length)
                playSpriteSheet(material, columns, length, loop)
            })
            return () => {
                releaseSpriteSheet(promise)
                spriteSheetPlaybackSystem.delete(material)
                handle.cancel()
            }
        }
        if (!texture || !columns || !length) return

        const handle = new Cancellable()
        loadSpriteSheet(material, texture, columns, length)
        const timeout = setTimeout(
            () => playSpriteSheet(material, columns, length, loop),
            300
        )
        return () => {
            clearTimeout(timeout)
            spriteSheetPlaybackSystem.delete(material)
            handle.cancel()
        }
    }
})
