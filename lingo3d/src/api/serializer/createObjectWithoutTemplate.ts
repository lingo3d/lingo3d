import Model from "../../display/Model"
import Dummy from "../../display/Dummy"
import CharacterRig from "../../display/CharacterRig"
import CharacterRigJoint from "../../display/CharacterRigJoint"
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
import PooledPointLight from "../../display/lights/PooledPointLight"
import PooledSpotLight from "../../display/lights/PooledSpotLight"
import Group from "../../display/Group"
import { GameObjectType } from "./types"
import ThirdPersonCamera from "../../display/cameras/ThirdPersonCamera"
import FirstPersonCamera from "../../display/cameras/FirstPersonCamera"
import OrbitCamera from "../../display/cameras/OrbitCamera"
import Skybox from "../../display/Skybox"
import Environment from "../../display/Environment"
import Setup from "../../display/Setup"
import Script from "../../display/Script"
import Timeline from "../../display/Timeline"
import TimelineAudio from "../../display/TimelineAudio"
import SpawnPoint from "../../display/SpawnPoint"
import SphericalJoint from "../../display/joints/SphericalJoint"
import FixedJoint from "../../display/joints/FixedJoint"
import RevoluteJoint from "../../display/joints/RevoluteJoint"
import PrismaticJoint from "../../display/joints/PrismaticJoint"
import D6Joint from "../../display/joints/D6Joint"
import Audio from "../../display/Audio"
import Appendable from "../../display/core/Appendable"
import Keyboard from "../../display/Keyboard"
import Mouse from "../../display/Mouse"
import { createObjectWithoutTemplatePtr } from "../../pointers/createObjectWithoutTemplatePtr"

export type GameObjectTypeWithoutTemplate = Exclude<GameObjectType, "template">

export const createObjectRecord = {
    group: () => new Group(),
    model: () => new Model(),
    svgMesh: () => new SvgMesh(),
    htmlMesh: () => new HTMLMesh(),
    joystick: () => new Joystick(),
    reticle: () => new Reticle(),
    splashScreen: () => new SplashScreen(),
    text: () => new Text(),
    mouse: () => new Mouse(),
    keyboard: () => new Keyboard(),
    dummy: () => new Dummy(),
    characterRig: () => new CharacterRig(),
    characterRigJoint: () => new CharacterRigJoint(),
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
    pooledPointLight: () => new PooledPointLight(),
    pooledSpotLight: () => new PooledSpotLight(),
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
    script: () => new Script(),
    timeline: () => new Timeline(),
    timelineAudio: () => new TimelineAudio()
} satisfies Record<GameObjectTypeWithoutTemplate, () => Appendable>

const createObjectWithoutTemplate = <T extends GameObjectTypeWithoutTemplate>(
    type: T
): ReturnType<(typeof createObjectRecord)[T]> =>
    createObjectRecord[type]() as any

export default createObjectWithoutTemplate
createObjectWithoutTemplatePtr[0] = createObjectWithoutTemplate
