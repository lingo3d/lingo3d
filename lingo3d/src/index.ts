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

import ParticleSystem from "./display/ParticleSystem"
import Model from "./display/Model"
import Dummy from "./display/Dummy"
import SvgMesh from "./display/SvgMesh"
import Reflector from "./display/Reflector"
import Sprite from "./display/Sprite"
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

import Trigger from "./display/Trigger"
import keyboard, { Keyboard } from "./api/keyboard"
import mouse, { Mouse } from "./api/mouse"
import gamepad from "./api/gamepad"
import createProxy from "./api/createProxy"
import settings from "./api/settings"
import preload from "./api/preload"
import { Sound } from "./api/Sound"
import screenshot from "./api/screenshot"

import applySetup from "./display/utils/serializer/applySetup"
import serialize from "./display/utils/serializer/serialize"
import deserialize from "./display/utils/serializer/deserialize"

import { rootContainer } from "./engine/renderLoop/renderSetup"
import { loop, timer } from "./engine/eventLoop"
import SimpleObjectManager from "./display/core/SimpleObjectManager"
import FoundManager from "./display/core/FoundManager"

import { onAfterRender } from "./events/onAfterRender"
import { onBeforeRender } from "./events/onBeforeRender"
import { LingoMouseEvent } from "./interface/IMouse"

import { Point3d, Point } from "@lincode/math"

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

    ParticleSystem,
    Model,
    Dummy,
    SvgMesh,
    Reflector,
    Sprite,
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

    Trigger,
    Keyboard,
    keyboard,
    Mouse,
    mouse,
    gamepad,
    createProxy,
    settings,
    preload,
    
    Sound,
    screenshot,

    applySetup,
    serialize,
    deserialize,
    
    loop,
    timer,

    rootContainer,
    SimpleObjectManager as Object,
    FoundManager,

    onAfterRender,
    onBeforeRender,
    LingoMouseEvent,

    Point3d,
    Point
}