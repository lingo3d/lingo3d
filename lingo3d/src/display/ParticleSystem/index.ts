import { createParticle } from "./Particle"
import Cube from "../primitives/Cube"
import { random } from "@lincode/utils"
import { Cancellable } from "@lincode/promiselikes"
import { textureLoader } from "../utils/loaders/loadTexture"
import { vector3 } from "../utils/reusables"
import flareData from "./flareData"

const flareTexture = textureLoader.load(flareData)

const randomRange = (val: number, range: number) => random(val - range, val + range)

export default class ParticleSystem extends Cube {
    public speed = 0.0
    public speedRange = 0.5

    public accel = 0.0
    public accelRange = 0.0

    public lifeTime = 500
    public lifeTimeRange = 0

    public spread = 0

    public size = 20
    public sizeRange = 0
    public sizeEnd: number | undefined

    public opacityRange = 0.0
    public opacityEnd: number | undefined

    public colorEnd: string | undefined

    private _frequency = 50
    public get frequency() {
        return this._frequency
    }
    public set frequency(val: number) {
        this._frequency = val
        this.handle && this.start()
    }
    
    private handle?: Cancellable

    public constructor() {
        super()

        this.width = this.height = this.depth = 20
        this.object3d.visible = false

        this.start()
    }

    public start() {
        this.handle?.cancel()
        this.handle = this.timer(1000 / this._frequency, Infinity, () => {
            const [, , , , m0, m1, m2] = this.outerObject3d.matrixWorld.elements
        
            const speed = randomRange(this.speed, this.speedRange)
            const [speedX, speedY, speedZ] = [speed * m0, speed * m1, speed * m2]

            const accel = randomRange(this.accel, this.accelRange)
            const [accelX, accelY, accelZ] = [accel * m0, accel * m1, accel * m2]

            const size = randomRange(this.size, this.sizeRange)
            const opacity = randomRange(this.opacity, this.opacityRange)

            this.outerObject3d.getWorldPosition(vector3)

            createParticle().init(
                flareTexture, this.bloom,
                size, this.sizeEnd,
                opacity, this.opacityEnd,
                this.color, this.colorEnd,
                vector3.x, vector3.y, vector3.z,
                accelX, accelY, accelZ,
                speedX + random(-this.spread, this.spread), speedY, speedZ + random(-this.spread, this.spread),
                randomRange(this.lifeTime, this.lifeTimeRange)
            )
        })
    }

    public stop() {
        this.handle?.cancel()
        this.handle = undefined
    }
}