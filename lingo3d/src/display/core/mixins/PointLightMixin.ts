import { PointLight, SpotLight } from "three"

export default abstract class PointLightMixin <T extends PointLight | SpotLight> {
    public abstract object3d: T

    public get decay() {
        return this.object3d.decay
    }
    public set decay(val: number) {
        this.object3d.decay = val
    }

    public get distance() {
        return this.object3d.distance
    }
    public set distance(val: number) {
        this.object3d.distance = val
    }

    public get power() {
        return this.object3d.power
    }
    public set power(val: number) {
        this.object3d.power = val
    }
}