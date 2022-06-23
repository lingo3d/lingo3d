import engine from "./engine"
import { preventTreeShake } from "@lincode/utils"
preventTreeShake(engine)

import Cube from "./display/primitives/Cube"
import Sphere from "./display/primitives/Sphere"
import Cone from "./display/primitives/Cone"
import Cylinder from "./display/primitives/Cylinder"
import Octahedron from "./display/primitives/Octahedron"
import Tetrahedron from "./display/primitives/Tetrahedron"
import Torus from "./display/primitives/Torus"
import Plane from "./display/primitives/Plane"
import Circle from "./display/primitives/Circle"

import Model from "./display/Model"
import Dummy from "./display/Dummy"
import Building from "./display/Building"
import SvgMesh from "./display/SvgMesh"
import Reflector from "./display/Reflector"
import Sprite from "./display/Sprite"
import Trigger from "./display/Trigger"
import Audio from "./display/Audio"
import Group from "./display/Group"
import Skybox from "./display/Skybox"
import Environment from "./display/Environment"
import Sky from "./display/Sky"
import Camera from "./display/cameras/Camera"
import ThirdPersonCamera from "./display/cameras/ThirdPersonCamera"
import FirstPersonCamera from "./display/cameras/FirstPersonCamera"
import OrbitCamera from "./display/cameras/OrbitCamera"
import AmbientLight from "./display/lights/AmbientLight"
import AreaLight from "./display/lights/AreaLight"
import DirectionalLight from "./display/lights/DirectionalLight"
import SkyLight from "./display/lights/SkyLight"
import PointLight from "./display/lights/PointLight"
import SpotLight from "./display/lights/SpotLight"

import circleShape from "./display/core/mixins/PhysicsMixin/cannon/shapes/circleShape"
import cubeShape from "./display/core/mixins/PhysicsMixin/cannon/shapes/cubeShape"
import cylinderShape from "./display/core/mixins/PhysicsMixin/cannon/shapes/cylinderShape"
import sphereShape from "./display/core/mixins/PhysicsMixin/cannon/shapes/sphereShape"
import torusShape from "./display/core/mixins/PhysicsMixin/cannon/shapes/torusShape"
import pillShape from "./display/core/mixins/PhysicsMixin/cannon/shapes/pillShape"

import keyboard, { Keyboard } from "./api/keyboard"
import mouse, { Mouse } from "./api/mouse"
import gamepad from "./api/gamepad"
import createProxy from "./api/createProxy"
import settings from "./api/settings"
import preload from "./api/preload"
import screenshot from "./api/screenshot"

import applySetup from "./api/serializer/applySetup"
import serialize from "./api/serializer/serialize"
import deserialize from "./api/serializer/deserialize"

import { loop, timer } from "./engine/eventLoop"

import mainOrbitCamera from "./engine/mainOrbitCamera"

import SimpleObjectManager from "./display/core/SimpleObjectManager"
import FoundManager from "./display/core/FoundManager"

import { onAfterRender } from "./events/onAfterRender"
import { onBeforeRender } from "./events/onBeforeRender"

import { Point3d, Point } from "@lincode/math"
import { setWasmPath } from "./states/useWasmPath"

export type { SimpleMouseEvent, LingoMouseEvent as MouseEvent } from "./interface/IMouse"

export default {}

export {
    Cube,
    Sphere,
    Cone,
    Cylinder,
    Octahedron,
    Tetrahedron,
    Torus,
    Plane,
    Circle,

    Model,
    Dummy,
    Building,
    SvgMesh,
    Reflector,
    Sprite,
    Trigger,
    Audio,
    Group,
    Skybox,
    Environment,
    Sky,
    Camera,
    ThirdPersonCamera,
    FirstPersonCamera,
    OrbitCamera,
    AmbientLight,
    AreaLight,
    DirectionalLight,
    SkyLight,
    PointLight,
    SpotLight,

    circleShape,
    cubeShape,
    cylinderShape,
    sphereShape,
    torusShape,
    pillShape,

    Keyboard,
    keyboard,
    Mouse,
    mouse,
    gamepad,
    createProxy,
    settings,
    preload,
    
    screenshot,

    applySetup,
    serialize,
    deserialize,
    
    loop,
    timer,
    
    mainOrbitCamera,

    SimpleObjectManager as Object,
    FoundManager,

    onAfterRender,
    onBeforeRender,

    Point3d,
    Point,
    setWasmPath
}