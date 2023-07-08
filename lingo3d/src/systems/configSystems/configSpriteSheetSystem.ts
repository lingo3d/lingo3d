import { Cancellable } from "@lincode/promiselikes"
import { SpriteMaterial } from "three"
import SpriteSheet from "../../display/SpriteSheet"
import loadTexture from "../../display/utils/loaders/loadTexture"
import { spriteSheetPool } from "../../pools/spriteSheetPool"
import { spriteSheetPlaybackSystem } from "../spriteSheetPlaySystem"
import createInternalSystem from "../utils/createInternalSystem"

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

export const configSpriteSheetSystem = createInternalSystem(
    "configSpriteSheetSystem",
    {
        data: {} as { cleanup: () => void },
        effect: (self: SpriteSheet, data) => {
            const {
                textureStart,
                textureEnd,
                texture,
                columns,
                length,
                loop,
                $innerObject: { material }
            } = self

            if (textureStart && textureEnd) {
                const handle = new Cancellable()
                const promise = spriteSheetPool.request([
                    textureStart,
                    textureEnd
                ])
                promise.then(([url, columns, length, blob]) => {
                    if (handle.done) return
                    self.$blob = blob
                    loadSpriteSheet(material, url, columns, length)
                    playSpriteSheet(material, columns, length, loop)
                })
                data.cleanup = () => {
                    spriteSheetPool.release(promise)
                    spriteSheetPlaybackSystem.delete(material)
                    handle.cancel()
                }
                return
            }
            if (!texture || !columns || !length) return false

            const handle = new Cancellable()
            loadSpriteSheet(material, texture, columns, length)
            const timeout = setTimeout(
                () => playSpriteSheet(material, columns, length, loop),
                300
            )
            data.cleanup = () => {
                clearTimeout(timeout)
                spriteSheetPlaybackSystem.delete(material)
                handle.cancel()
            }
        },
        cleanup: (_, data) => {
            data.cleanup()
        }
    }
)
