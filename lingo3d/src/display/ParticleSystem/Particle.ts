import { SpriteMaterial, Sprite, Texture, Color } from "three"
import scene from "../../engine/scene"
import { scaleDown } from "../../engine/constants"
import { addBloom, deleteBloom } from "../../engine/render/effectComposer/selectiveBloomPass/renderSelectiveBloom"
import { loop } from "../../engine/eventLoop"

const disposed: Array<Particle> = []
const colorObj = new Color()
const colorEndObj = new Color()

let colorOld = ""
let colorEndOld = ""

export const createParticle = () => {
    return disposed.pop() ?? new Particle()
}

const activeParticles = new Set<Particle>()

loop(() => {
    for (const particle of activeParticles)
        particle.update()
})

export default class Particle {
    private material = new SpriteMaterial()
    private sprite = new Sprite(this.material)

    private startTime!: number

    private accelX!: number
    private accelY!: number
    private accelZ!: number

    private speedX!: number
    private speedY!: number
    private speedZ!: number

    private lifeTime!: number

    private scaleStart!: number
    private sizeRange!: number
    
    private opacityStart!: number
    private opacityRange!: number

    private rStart!: number
    private rRange!: number

    private gStart!: number
    private gRange!: number

    private bStart!: number
    private bRange!: number

    public init(
        texture: Texture,
        bloom: boolean,
        size: number,
        sizeEnd = size,
        opacity: number,
        opacityEnd = opacity,
        color: string,
        colorEnd = color,
        worldX: number,
        worldY: number,
        worldZ: number,
        accelX: number,
        accelY: number,
        accelZ: number,
        speedX: number,
        speedY: number,
        speedZ: number,
        lifeTime: number
    ) {
        activeParticles.add(this)
        
        this.material.map = texture
        
        bloom ? addBloom(this.sprite) : deleteBloom(this.sprite)
        
        this.accelX = accelX * scaleDown
        this.accelY = accelY * scaleDown
        this.accelZ = accelZ * scaleDown
        this.speedX = speedX * scaleDown
        this.speedY = speedY * scaleDown
        this.speedZ = speedZ * scaleDown
        this.lifeTime = lifeTime
        this.startTime = Date.now()

        scene.add(this.sprite)

        this.scaleStart = this.sprite.scale.x = this.sprite.scale.y = size * scaleDown
        this.sizeRange = (sizeEnd - size) * scaleDown

        this.opacityStart = this.material.opacity = opacity
        this.opacityRange = opacityEnd - opacity

        if (color !== colorOld) {
            colorOld = color
            colorObj.set(color)
        }
        if (colorEndOld !== colorEnd) {
            colorEndOld = colorEnd
            colorEndObj.set(colorEnd)
        }

        this.rStart = this.material.color.r = colorObj.r
        this.rRange = colorEndObj.r - colorObj.r

        this.gStart = this.material.color.g = colorObj.g
        this.gRange = colorEndObj.g - colorObj.g

        this.bStart = this.material.color.b = colorObj.b
        this.bRange = colorEndObj.b - colorObj.b

        this.sprite.position.set(worldX, worldY, worldZ)
    }

    public update() {
        const currentTime = Date.now() - this.startTime

        if (currentTime  > this.lifeTime) {
            this.dispose()
            return
        }
        this.sprite.position.x += (this.speedX += this.accelX)
        this.sprite.position.y += (this.speedY += this.accelY)
        this.sprite.position.z += (this.speedZ += this.accelZ)

        const timeRatio = currentTime / this.lifeTime

        const deltaScale = timeRatio * this.sizeRange
        this.sprite.scale.x = this.sprite.scale.y = this.scaleStart + deltaScale

        const deltaOpacity = timeRatio * this.opacityRange
        this.material.opacity = this.opacityStart + deltaOpacity

        const deltar = timeRatio * this.rRange
        this.material.color.r = this.rStart + deltar

        const deltag = timeRatio * this.gRange
        this.material.color.g = this.gStart + deltag
        
        const deltab = timeRatio * this.bRange
        this.material.color.b = this.bStart + deltab
    }

    public dispose() {
        scene.remove(this.sprite)
        activeParticles.delete(this)
        disposed.push(this)
    }
}