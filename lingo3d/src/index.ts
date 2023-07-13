import "./engine"

import Primitive from "./display/core/Primitive"
import { System } from "./systems/utils/createInternalSystem"
import { LingoMouseEvent } from "./interface/IMouse"
import { LingoKeyboardEvent } from "./interface/IKeyboard"

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
import CharacterRig from "./display/CharacterRig"
import CharacterRigJoint from "./display/CharacterRigJoint"
import SvgMesh from "./display/SvgMesh"
import HTMLMesh from "./display/HTMLMesh"
import Reflector from "./display/Reflector"
import Water from "./display/Water"
import Sprite from "./display/Sprite"
import SpriteSheet from "./display/SpriteSheet"
import Group from "./display/Group"

import Curve from "./display/Curve"
import Line from "./display/Line"
import SpawnPoint from "./display/SpawnPoint"

import SphericalJoint from "./display/joints/SphericalJoint"
import FixedJoint from "./display/joints/FixedJoint"
import RevoluteJoint from "./display/joints/RevoluteJoint"
import PrismaticJoint from "./display/joints/PrismaticJoint"
import D6Joint from "./display/joints/D6Joint"

import Audio from "./display/Audio"
import Skybox from "./display/Skybox"
import Environment from "./display/Environment"
import Setup from "./display/Setup"
import Template from "./display/Template"
import Script from "./display/Script"
import Timeline from "./display/Timeline"
import TimelineAudio from "./display/TimelineAudio"
import Sky from "./display/Sky"
import Camera from "./display/cameras/Camera"
import ThirdPersonCamera from "./display/cameras/ThirdPersonCamera"
import FirstPersonCamera from "./display/cameras/FirstPersonCamera"
import OrbitCamera from "./display/cameras/OrbitCamera"
import AmbientLight from "./display/lights/AmbientLight"
import AreaLight from "./display/lights/AreaLight"
import DirectionalLight from "./display/lights/DirectionalLight"
import SkyLight from "./display/lights/SkyLight"
import DefaultSkyLight from "./display/lights/DefaultSkyLight"
import PointLight from "./display/lights/PointLight"
import SpotLight from "./display/lights/SpotLight"
import PooledPointLight from "./display/lights/PooledPointLight"
import PooledSpotLight from "./display/lights/PooledSpotLight"

import Joystick from "./ui/Joystick"
import Reticle from "./ui/Reticle"
import SplashScreen from "./ui/SplashScreen"
import Text from "./ui/Text"

import Keyboard from "./display/Keyboard"
import Mouse from "./display/Mouse"

import createSystem from "./systems/utils/createSystem"
import createProxy from "./api/createProxy"
import settings from "./api/settings"
import preload from "./api/preload"
import screenshot from "./api/screenshot"
import root from "./api/root"
import frameSync from "./api/frameSync"
import isBusy from "./api/isBusy"

import serialize from "./api/serializer/serialize"
import deserialize from "./api/serializer/deserialize"

import { onAfterRender } from "./events/onAfterRender"
import { onBeforeRender } from "./events/onBeforeRender"

import Point from "./math/Point"
import Point3d from "./math/Point3d"
import clientToWorld from "./display/utils/clientToWorld"
import math from "./math"

import { setAssetsPath } from "./pointers/assetsPathPointers"
import { VERSION } from "./globals"

const keyboard = new Keyboard()
keyboard.$ghost()
keyboard.$disableUnload = true

const mouse = new Mouse()
mouse.$ghost()
mouse.$disableUnload = true

type GameObject = Model & Primitive
export type {
    Primitive,
    System,
    GameObject,
    LingoMouseEvent,
    LingoKeyboardEvent
}

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
    CharacterRig,
    CharacterRigJoint,
    SvgMesh,
    HTMLMesh,
    Reflector,
    Water,
    Sprite,
    SpriteSheet,
    Group,
    Curve,
    Line,
    SpawnPoint,
    SphericalJoint,
    FixedJoint,
    RevoluteJoint,
    PrismaticJoint,
    D6Joint,
    Audio,
    Skybox,
    Environment,
    Setup,
    Template,
    Script,
    Timeline,
    TimelineAudio,
    Sky,
    Camera,
    ThirdPersonCamera,
    FirstPersonCamera,
    OrbitCamera,
    AmbientLight,
    AreaLight,
    DirectionalLight,
    SkyLight,
    DefaultSkyLight,
    PointLight,
    SpotLight,
    PooledPointLight,
    PooledSpotLight,
    Joystick,
    Reticle,
    SplashScreen,
    Text,
    Keyboard,
    Mouse,
    createSystem,
    createProxy,
    settings,
    preload,
    screenshot,
    root,
    frameSync,
    isBusy,
    serialize,
    deserialize,
    onAfterRender,
    onBeforeRender,
    Point,
    Point3d,
    clientToWorld,
    math,
    keyboard,
    mouse,
    setAssetsPath,
    VERSION
}
