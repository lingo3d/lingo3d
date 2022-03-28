import engine from "./engine"
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
import SvgMesh from "./display/SvgMesh"
import Sprite from "./display/Sprite"
import Reflector from "./display/Reflector"
import GroundReflector from "./display/GroundReflector"
import Scene from "./display/Scene"
import Group from "./display/Group"
import Skybox from "./display/Skybox"
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

import circleShape from "./display/core/SimpleObjectManager/PhysicsItem/cannon/shapes/circleShape"
import cubeShape from "./display/core/SimpleObjectManager/PhysicsItem/cannon/shapes/cubeShape"
import cylinderShape from "./display/core/SimpleObjectManager/PhysicsItem/cannon/shapes/cylinderShape"
import sphereShape from "./display/core/SimpleObjectManager/PhysicsItem/cannon/shapes/sphereShape"
import torusShape from "./display/core/SimpleObjectManager/PhysicsItem/cannon/shapes/torusShape"
import pillShape from "./display/core/SimpleObjectManager/PhysicsItem/cannon/shapes/pillShape"

import keyboard, { Keyboard } from "./api/keyboard"
import mouse, { Mouse } from "./api/mouse"
import gamepad from "./api/gamepad"
import background from "./api/background"
import rendering from "./api/rendering"
import settings from "./api/settings"
import preload from "./api/preload"
// import HandTracker from "./api/HandTracker"
import Point3d from "./api/Point3d"

import applySetup from "./display/utils/deserialize/applySetup"
import { container, outline } from "./engine/render/renderSetup"
import { loop, timer } from "./engine/eventLoop"
import { preventTreeShake } from "@lincode/utils"

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
    SvgMesh,
    Sprite,
    Reflector,
    GroundReflector,
    Scene,
    Group,
    Skybox,
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
    background,
    rendering,
    settings,
    preload,
    
    // HandTracker,
    Point3d,

    applySetup,
    outline,
    container,
    loop,
    timer
}