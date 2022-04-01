import ICameraMixin, { cameraMixinDefaults } from "./ICameraMixin";
import IEventLoop, { eventLoopDefaults } from "./IEventLoop"

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

export const orbitCameraDefaults: IOrbitCamera = {
    ...eventLoopDefaults,
    ...cameraMixinDefaults,

    targetX: 0,
    targetY: 0,
    targetZ: 0,
    
    x: 0,
    y: 0,
    z: 500,

    enableDamping: false,
    enablePan: false,
    enableZoom: false,
    autoRotate: false,
    autoRotateSpeed: 2
}