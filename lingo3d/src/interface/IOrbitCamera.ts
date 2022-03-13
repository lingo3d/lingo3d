import ICameraMixin from "./ICameraMixin";
import IEventLoop from "./IEventLoop"

export default interface IOrbitCamera extends IEventLoop, ICameraMixin {
    targetX: number
    targetY: number
    targetZ: number
    x: number
    y: number
    z: number
    enableDamping: boolean
    enablePan: boolean
    enableZoom: boolean
    autoRotate: boolean
    autoRotateSpeed: number
}