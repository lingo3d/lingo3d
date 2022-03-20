import { camFar, camNear } from "../../../engine/constants"
import IAreaLight from "../../../interface/IAreaLight"
import ICamera from "../../../interface/ICamera"
import ILight from "../../../interface/ILight"
import ILoaded from "../../../interface/ILoaded"
import IModel from "../../../interface/IModel"
import IObjectManager from "../../../interface/IObjectManager"
import IPointLight from "../../../interface/IPointLight"
import IPrimitive from "../../../interface/IPrimitive"
import IReflector from "../../../interface/IReflector"
import IScene from "../../../interface/IScene"
import ISkyLight from "../../../interface/ISkyLight"
import ISpotLight from "../../../interface/ISpotLight"
import ISprite from "../../../interface/ISprite"
import ISvgMesh from "../../../interface/ISvgMesh"
import ITexturedBasic from "../../../interface/ITexturedBasic"
import ITexturedStandard from "../../../interface/ITexturedStandard"

type Omitted = "name" | "animations" | "physics" | "physicsShape" | "maxAngularVelocityX" | "maxAngularVelocityY" | "maxAngularVelocityZ" | "maxVelocityX" | "maxVelocityY" | "maxVelocityZ"

export const objectManagerProps: Omit<IObjectManager, Omitted> = {
    x: 0,
    y: 0,
    z: 0,
    width: 100,
    height: 100,
    depth: 100,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    innerX: 0,
    innerY: 0,
    innerZ: 0,
    innerRotation: 0,
    innerRotationX: 0,
    innerRotationY: 0,
    innerRotationZ: 0,
    bloom: false,
    reflection: false,
    visible: true,
    innerVisible: true
}

export const loadedProps: Omit<ILoaded, Omitted> = {
    ...objectManagerProps,
    src: "",
    boxVisible: false
}

export const texturedBasicProps: ITexturedBasic = {
    color: "white",
    vertexColors: false,
    fog: true,
    opacity: 1,
    texture: "",
    alphaMap: "",
    textureRepeat: 0
}

export const texturedStandardProps: ITexturedStandard = {
    color: "white",
    flatShading: false,
    wireframe: false,
    envMap: "",
    aoMap: "",
    aoMapIntensity: 1,
    bumpMap: "",
    bumpScale: 1,
    displacementMap: "",
    displacementScale: 1,
    displacementBias: 0,
    emissiveColor: "black",
    emissiveMap: "",
    emissiveIntensity: 1,
    lightMap: "",
    lightMapIntensity: 1,
    metalnessMap: "",
    metalness: 0,
    roughnessMap: "",
    roughness: 1,
    normalMap: "",
    normalScale: 1,
    normalMapType: "objectSpace"
}

export const lightProps: Omit<ILight, Omitted> = {
    ...objectManagerProps,
    color: "white",
    intensity: 1
}

const primitiveProps: Omit<IPrimitive, Omitted> = {
    ...texturedBasicProps,
    ...texturedStandardProps,
    ...objectManagerProps
}

const group: Omit<IObjectManager, Omitted> = objectManagerProps

export const model: Omit<IModel, Omitted> = {
    ...loadedProps,
    loadedScale: 1,
    loadedX: 0,
    loadedY: 0,
    loadedZ: 0
}

const svgMesh: Omit<ISvgMesh, Omitted> = {
    ...loadedProps,
    ...primitiveProps
}

const sprite: Omit<ISprite, Omitted> = {
    ...texturedBasicProps,
    ...objectManagerProps
}

const reflector: Omit<IReflector, Omitted> = {
    ...objectManagerProps,
    contrast: 0,
    blur: 0
}

const scene: Omit<IScene, Omitted> = loadedProps

const ambientLight: Omit<ILight, Omitted> = lightProps

export const areaLight: Omit<IAreaLight, Omitted> = {
    ...lightProps,
    power: 10 * Math.PI
}

const directionalLight: Omit<ILight, Omitted> = lightProps

export const skyLight: Omit<ISkyLight, Omitted> = {
    ...lightProps,
    groundColor: "white"
}

export const pointLight: Omit<IPointLight, Omitted> = {
    ...lightProps,
    decay: 1,
    distance: 0,
    power: 12.566
}

export const spotLight: Omit<ISpotLight, Omitted> = {
    ...pointLight,
    angle: 1,
    penumbra: 0
}

export const camera: Omit<ICamera, Omitted | "minPolarAngle" | "maxPolarAngle" | "mouseControl" | "active"> = {
    ...objectManagerProps,
    fov: 75,
    zoom: 1,
    near: camNear,
    far: camFar,
    bokeh: false,
    bokehFocus: 1,
    bokehMaxBlur: 0.01,
    bokehAperture: 0.025
}

const circle = primitiveProps
const cone = primitiveProps
const cube = primitiveProps
const cylinder = primitiveProps
const octahedron = primitiveProps
const plane = primitiveProps
const sphere = primitiveProps
const tetrahedron = primitiveProps
const torus = primitiveProps

export default {
    group,
    model,
    svgMesh,
    sprite,
    reflector,
    scene,
    ambientLight,
    areaLight,
    directionalLight,
    skyLight,
    pointLight,
    spotLight,
    camera,
    circle,
    cone,
    cube,
    cylinder,
    octahedron,
    plane,
    sphere,
    tetrahedron,
    torus
}