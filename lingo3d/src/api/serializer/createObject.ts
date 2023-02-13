import Model from "../../display/Model"
import Dummy from "../../display/Dummy"
import Building from "../../display/Building"
import Tree from "../../display/Tree"
import SvgMesh from "../../display/SvgMesh"
import HTMLMesh from "../../display/HTMLMesh"
import Joystick from "../../ui/Joystick"
import Reticle from "../../ui/Reticle"
import SplashScreen from "../../ui/SplashScreen"
import Text from "../../ui/Text"
import Reflector from "../../display/Reflector"
import Water from "../../display/Water"
import Curve from "../../display/Curve"
import Sprite from "../../display/Sprite"
import SpriteSheet from "../../display/SpriteSheet"
import Circle from "../../display/primitives/Circle"
import Cone from "../../display/primitives/Cone"
import Cube from "../../display/primitives/Cube"
import Cylinder from "../../display/primitives/Cylinder"
import Octahedron from "../../display/primitives/Octahedron"
import Plane from "../../display/primitives/Plane"
import Sphere from "../../display/primitives/Sphere"
import Tetrahedron from "../../display/primitives/Tetrahedron"
import Torus from "../../display/primitives/Torus"
import Camera from "../../display/cameras/Camera"
import AmbientLight from "../../display/lights/AmbientLight"
import AreaLight from "../../display/lights/AreaLight"
import DirectionalLight from "../../display/lights/DirectionalLight"
import SkyLight from "../../display/lights/SkyLight"
import DefaultSkyLight from "../../display/lights/DefaultSkyLight"
import PointLight from "../../display/lights/PointLight"
import SpotLight from "../../display/lights/SpotLight"
import Group from "../../display/Group"
import { GameObjectType } from "./types"
import ThirdPersonCamera from "../../display/cameras/ThirdPersonCamera"
import FirstPersonCamera from "../../display/cameras/FirstPersonCamera"
import OrbitCamera from "../../display/cameras/OrbitCamera"
import Skybox from "../../display/Skybox"
import Environment from "../../display/Environment"
import Setup from "../../display/Setup"
import Timeline from "../../display/Timeline"
import TimelineAudio from "../../display/TimelineAudio"
import GameGraph from "../../display/GameGraph"
import Connector from "../../display/Connector"
import SpawnPoint from "../../display/SpawnPoint"
import SphericalJoint from "../../display/joints/SphericalJoint"
import FixedJoint from "../../display/joints/FixedJoint"
import RevoluteJoint from "../../display/joints/RevoluteJoint"
import PrismaticJoint from "../../display/joints/PrismaticJoint"
import D6Joint from "../../display/joints/D6Joint"
import Audio from "../../display/Audio"
import Appendable from "../core/Appendable"

const record = {
    group: () => new Group(),
    model: () => new Model(),
    svgMesh: () => new SvgMesh(),
    htmlMesh: () => new HTMLMesh(),
    joystick: () => new Joystick(),
    reticle: () => new Reticle(),
    splashScreen: () => new SplashScreen(),
    text: () => new Text(),
    dummy: () => new Dummy(),
    building: () => new Building(),
    tree: () => new Tree(),
    reflector: () => new Reflector(),
    water: () => new Water(),
    curve: () => new Curve(),
    sprite: () => new Sprite(),
    spriteSheet: () => new SpriteSheet(),
    spawnPoint: () => new SpawnPoint(),
    sphericalJoint: () => new SphericalJoint(),
    fixedJoint: () => new FixedJoint(),
    revoluteJoint: () => new RevoluteJoint(),
    prismaticJoint: () => new PrismaticJoint(),
    d6Joint: () => new D6Joint(),
    audio: () => new Audio(),
    camera: () => new Camera(),
    thirdPersonCamera: () => new ThirdPersonCamera(),
    firstPersonCamera: () => new FirstPersonCamera(),
    orbitCamera: () => new OrbitCamera(),
    ambientLight: () => new AmbientLight(),
    areaLight: () => new AreaLight(),
    directionalLight: () => new DirectionalLight(),
    skyLight: () => new SkyLight(),
    defaultSkyLight: () => new DefaultSkyLight(),
    pointLight: () => new PointLight(),
    spotLight: () => new SpotLight(),
    circle: () => new Circle(),
    cone: () => new Cone(),
    cube: () => new Cube(),
    cylinder: () => new Cylinder(),
    octahedron: () => new Octahedron(),
    plane: () => new Plane(),
    sphere: () => new Sphere(),
    tetrahedron: () => new Tetrahedron(),
    torus: () => new Torus(),
    skybox: () => new Skybox(),
    environment: () => new Environment(),
    setup: () => new Setup(),
    timeline: () => new Timeline(),
    timelineAudio: () => new TimelineAudio(),
    gameGraph: () => new GameGraph(),
    connector: () => new Connector()
} satisfies Record<GameObjectType, () => Appendable>

export default <T extends GameObjectType>(
    type: T
): ReturnType<(typeof record)[T]> => record[type]() as any
