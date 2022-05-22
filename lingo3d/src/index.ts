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
import Sky from "./display/Sky"
import Camera from "./display/cameras/Camera"
import ThirdPersonCamera from "./display/cameras/ThirdPersonCamera"
import FirstPersonCamera from "./display/cameras/FirstPersonCamera"
import OrbitCamera from "./display/cameras/OrbitCamera"
import AmbientLight from "./display/lights/AmbientLight"
import AreaLight from "./display/lights/AreaLight"
import BoxLight from "./display/lights/BoxLight"
import DirectionalLight from "./display/lights/DirectionalLight"
import SkyLight from "./display/lights/SkyLight"
import PointLight from "./display/lights/PointLight"
import SpotLight from "./display/lights/SpotLight"

import circleShape from "./display/core/SimpleObjectManager/PhysicsItem/cannon/shapes/circleShape"
import cubeShape from "./display/core/SimpleObjectManager/PhysicsItem/cannon/shapes/cubeShape"
import cylinderShape from "./display/core/SimpleObjectManager/PhysicsItem/cannon/shapes/cylinderShape"
import sphereShape from "./display/core/SimpleObjectManager/PhysicsItem/cannon/shapes/sphereShape"
import torusShape from "./display/core/SimpleObjectManager/PhysicsItem/cannon/shapes/torusShape"
import pillShape from "./display/core/SimpleObjectManager/PhysicsItem/cannon/shapes/pillShape"

import Trigger from "./api/Trigger"
import keyboard, { Keyboard } from "./api/keyboard"
import mouse, { Mouse } from "./api/mouse"
import gamepad from "./api/gamepad"
import settings from "./api/settings"
import preload from "./api/preload"
// import HandTracker from "./api/HandTracker"
import Point3d from "./api/Point3d"
import { Sound } from "./api/Sound"
import screenshot from "./api/screenshot"

import applySetup from "./display/utils/serializer/applySetup"
import { rootContainer } from "./engine/renderLoop/renderSetup"
import { loop, timer } from "./engine/eventLoop"
import SimpleObjectManager from "./display/core/SimpleObjectManager"
import FoundManager from "./display/core/FoundManager"
import { onAfterRender } from "./events/onAfterRender"

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
    Sky,
    Camera,
    ThirdPersonCamera,
    FirstPersonCamera,
    OrbitCamera,
    AmbientLight,
    AreaLight,
    BoxLight,
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
    settings,
    preload,
    
    // HandTracker,
    Point3d,
    Sound,
    screenshot,

    applySetup,
    loop,
    timer,
    onAfterRender,

    rootContainer,
    SimpleObjectManager as Object,
    FoundManager as Find
}