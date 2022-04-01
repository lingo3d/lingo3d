import { groupDefaults } from "../../../interface/IGroup"
import { modelDefaults } from "../../../interface/IModel"
import { reflectorDefaults } from "../../../interface/IReflector"
import { sceneDefaults } from "../../../interface/IScene"
import { spriteDefaults } from "../../../interface/ISprite"
import { svgMeshDefaults } from "../../../interface/ISvgMesh"
import { ambientLightDefaults } from "../../../interface/IAmbientLight"
import { AmbientOcclusion } from "../../../states/useAmbientOcclusion"
import { DefaultLight } from "../../../states/useDefaultLight"
import { PerformanceValue } from "../../../states/usePerformance"
import { areaLightDefaults } from "../../../interface/IAreaLight"
import { directionalLightDefaults } from "../../../interface/IDirectionalLight"
import { skyLightDefaults } from "../../../interface/ISkyLight"
import { pointLightDefaults } from "../../../interface/IPointLight"
import { spotLightDefaults } from "../../../interface/ISpotLight"
import { cameraDefaults } from "../../../interface/ICamera"
import { primitiveDefaults } from "../../../interface/IPrimitive"

const schema = {
    group: groupDefaults,
    model: modelDefaults,
    svgMesh: svgMeshDefaults,
    sprite: spriteDefaults,
    reflector: reflectorDefaults,
    scene: sceneDefaults,
    ambientLight: ambientLightDefaults,
    areaLight: areaLightDefaults,
    directionalLight: directionalLightDefaults,
    skyLight: skyLightDefaults,
    pointLight: pointLightDefaults,
    spotLight: spotLightDefaults,
    camera: cameraDefaults,
    circle: primitiveDefaults,
    cone: primitiveDefaults,
    cube: primitiveDefaults,
    cylinder: primitiveDefaults,
    octahedron: primitiveDefaults,
    plane: primitiveDefaults,
    sphere: primitiveDefaults,
    tetrahedron: primitiveDefaults,
    torus: primitiveDefaults
}

export type GameObjectType = keyof typeof schema

export type AnimationData = Record<
    string,//property name
    Record<
        string,//frame number cast as string
        number//frame value
    >
>

export type AnimationNode = {
    type: "animation"
    uuid: string
    name: string
    data: Record<
        string,//target uuid
        AnimationData
    >
}

export type SetupNode = {
    type: "setup"
    performance?: PerformanceValue
    gridHelper?: boolean
    cameraHelper?: boolean
    lightHelper?: boolean
    defaultFog?: boolean
    defaultLight?: DefaultLight
    defaultOrbitControls?: boolean
    logarithmicDepth?: boolean
    toneMapping?: boolean
    exposure?: number
    bloom?: boolean
    bloomStrength?: number
    bloomRadius?: number
    bloomThreshold?: number
    bokeh?: boolean
    bokehFocus?: number
    bokehMaxBlur?: number
    bokehAperture?: number
    ambientOcclusion?: AmbientOcclusion
    texture?: string
    skybox?: string
    color?: string
}

type Node = {
    type: GameObjectType
    uuid: string
    name?: string
    children?: Array<BaseSceneGraphNode>
}

export const nonSerializedProperties = <const>["type", "uuid", "name", "children"]

type TypedPropsNode<Props, Type extends GameObjectType> = Partial<Props> & Node & { type: Type }

export type GroupNode = TypedPropsNode<typeof schema.group, "group">

export type ModelNode = TypedPropsNode<typeof schema.model, "model">

export type SvgMeshNode = TypedPropsNode<typeof schema.svgMesh, "svgMesh">

export type SpriteNode = TypedPropsNode<typeof schema.sprite, "sprite">

export type ReflectorNode = TypedPropsNode<typeof schema.reflector, "reflector">

export type SceneNode = TypedPropsNode<typeof schema.scene, "scene">

export type CameraNode = TypedPropsNode<typeof schema.camera, "camera">

export type AmbientLightNode = TypedPropsNode<typeof schema.ambientLight, "ambientLight">

export type AreaLightNode = TypedPropsNode<typeof schema.areaLight, "areaLight">

export type DirectionalLightNode = TypedPropsNode<typeof schema.directionalLight, "directionalLight">

export type SkyLightNode = TypedPropsNode<typeof schema.skyLight, "skyLight">

export type PointLightNode = TypedPropsNode<typeof schema.pointLight, "pointLight">

export type SpotLightNode = TypedPropsNode<typeof schema.spotLight, "spotLight">

export type CircleNode = TypedPropsNode<typeof schema.circle, "circle">

export type ConeNode = TypedPropsNode<typeof schema.cone, "cone">

export type CubeNode = TypedPropsNode<typeof schema.cube, "cube">

export type CylinderNode = TypedPropsNode<typeof schema.cylinder, "cylinder">

export type OctahedronNode = TypedPropsNode<typeof schema.octahedron, "octahedron">

export type PlaneNode = TypedPropsNode<typeof schema.plane, "plane">

export type SphereNode = TypedPropsNode<typeof schema.sphere, "sphere">

export type TetrahedronNode = TypedPropsNode<typeof schema.tetrahedron, "tetrahedron">

export type TorusNode = TypedPropsNode<typeof schema.torus, "torus">

export type BaseSceneGraphNode = GroupNode | ModelNode | SvgMeshNode | SpriteNode | ReflectorNode | SceneNode | CameraNode | AmbientLightNode | AreaLightNode | DirectionalLightNode | SkyLightNode | PointLightNode | SpotLightNode | CircleNode | ConeNode | CubeNode | CylinderNode | OctahedronNode | PlaneNode | SphereNode | TetrahedronNode | TorusNode

export type SceneGraphNode = BaseSceneGraphNode | AnimationNode | SetupNode