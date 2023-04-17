import "./engine"

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
import DummyIK from "./display/DummyIK"
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

import GameGraph from "./visualScripting/GameGraph"
import Connector from "./visualScripting/Connector"
import MathNode from "./visualScripting/MathNode"
import NumberNode from "./visualScripting/NumberNode"
import AddNode from "./visualScripting/AddNode"
import ProjectionNode from "./visualScripting/ProjectionNode"
import SpawnNode from "./visualScripting/SpawnNode"
import LoopNode from "./visualScripting/LoopNode"
import TemplateNode from "./visualScripting/TemplateNode"

import Audio from "./display/Audio"
import Skybox from "./display/Skybox"
import Environment from "./display/Environment"
import Setup from "./display/Setup"
import Template from "./display/Template"
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

import Joystick from "./ui/Joystick"
import Reticle from "./ui/Reticle"
import SplashScreen from "./ui/SplashScreen"
import Text from "./ui/Text"

import Keyboard from "./display/Keyboard"
import Mouse from "./display/Mouse"
import createProxy from "./api/createProxy"
import settings from "./api/settings"
import preload from "./api/preload"
import screenshot from "./api/screenshot"
import { setAssetsPath } from "./api/assetsPath"

import serialize from "./api/serializer/serialize"
import deserialize from "./api/serializer/deserialize"

import downloadBlob from "./api/files/downloadBlob"
import downloadText from "./api/files/downloadText"
import exportJSON from "./api/files/exportJSON"
import exportReact from "./api/files/exportReact"
import exportVue from "./api/files/exportVue"
import openFolder from "./api/files/openFolder"
import openJSON from "./api/files/openJSON"
import saveJSON from "./api/files/saveJSON"

import { loop, timer } from "./engine/eventLoop"

import ObjectManager from "./display/core/ObjectManager"
import FoundManager from "./display/core/FoundManager"

import { onAfterRender } from "./events/onAfterRender"
import { onBeforeRender } from "./events/onBeforeRender"

import { Point } from "@lincode/math"
import Point3d from "./math/Point3d"
import clientToWorld from "./display/utils/clientToWorld"
import mathFn from "./math/mathFn"

import { SimpleMouseEvent, LingoMouseEvent } from "./interface/IMouse"
import { LingoKeyboardEvent } from "./interface/IKeyboard"
import { HitEvent } from "./interface/IVisible"

const keyboard = new Keyboard()
keyboard.disableSceneGraph = true
keyboard.disableSerialize = true
keyboard.disableUnload = true

const mouse = new Mouse()
mouse.disableSceneGraph = true
mouse.disableSerialize = true
mouse.disableUnload = true

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
    DummyIK,
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
    GameGraph,
    Connector,
    MathNode,
    NumberNode,
    AddNode,
    ProjectionNode,
    SpawnNode,
    LoopNode,
    TemplateNode,
    Audio,
    Skybox,
    Environment,
    Setup,
    Template,
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
    Joystick,
    Reticle,
    SplashScreen,
    Text,
    keyboard,
    Keyboard,
    mouse,
    Mouse,
    createProxy,
    settings,
    preload,
    screenshot,
    setAssetsPath,
    serialize,
    deserialize,
    downloadBlob,
    downloadText,
    exportJSON,
    exportReact,
    exportVue,
    openFolder,
    openJSON,
    saveJSON,
    loop,
    timer,
    ObjectManager as Object,
    FoundManager as Found,
    onAfterRender,
    onBeforeRender,
    Point3d,
    Point,
    clientToWorld,
    mathFn,
    SimpleMouseEvent,
    LingoMouseEvent,
    LingoKeyboardEvent,
    HitEvent
}
