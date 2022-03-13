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

const objectManagerProps: Omit<IObjectManager, Omitted> = {
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
    visible: true
}

const loadedProps: Omit<ILoaded, Omitted> = {
    ...objectManagerProps,
    src: "",
    boxVisible: false
}

const texturedBasicProps: ITexturedBasic = {
    color: "",
    vertexColors: true,
    fog: true,
    opacity: 0,
    texture: "",
    alphaMap: ""
}

const texturedStandardProps: ITexturedStandard = {
    color: "",
    flatShading: true,
    wireframe: true,
    envMap: "",
    aoMap: "",
    aoMapIntensity: 0,
    bumpMap: "",
    bumpScale: 0,
    displacementMap: "",
    displacementScale: 0,
    displacementBias: 0,
    emissiveColor: "",
    emissiveMap: "",
    emissiveIntensity: 0,
    lightMap: "",
    lightMapIntensity: 0,
    metalnessMap: "",
    metalness: 0,
    roughnessMap: "",
    roughness: 0,
    normalMap: "",
    normalScale: 0,
    normalMapType: "objectSpace",
    refractionRatio: 0
}

const lightProps: Omit<ILight, Omitted> = {
    ...objectManagerProps,
    color: "",
    intensity: 0
}

const primitiveProps: Omit<IPrimitive, Omitted> = {
    ...texturedBasicProps,
    ...texturedStandardProps,
    ...objectManagerProps
}

const group: Omit<IObjectManager, Omitted> = objectManagerProps

const model: Omit<IModel, Omitted> = {
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

const areaLight: Omit<IAreaLight, Omitted> = {
    ...lightProps,
    power: 0
}

const directionalLight: Omit<ILight, Omitted> = lightProps

const skyLight: Omit<ISkyLight, Omitted> = {
    ...lightProps,
    groundColor: ""
}

const pointLight: Omit<IPointLight, Omitted> = {
    ...lightProps,
    decay: 0,
    distance: 0,
    power: 0
}

const spotLight: Omit<ISpotLight, Omitted> = {
    ...pointLight,
    angle: 0,
    penumbra: 0
}

const camera: Omit<ICamera, Omitted | "minPolarAngle" | "maxPolarAngle" | "mouseControl" | "active"> = {
    ...objectManagerProps,
    fov: 0,
    zoom: 0,
    bokeh: true,
    bokehFocus: 0,
    bokehMaxBlur: 0,
    bokehAperture: 0
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