import ObjectManager from "../../core/ObjectManager"
import Model from "../../Model"
import SvgMesh from "../../SvgMesh"
import Sprite from "../../Sprite"
import Reflector from "../../Reflector"
import Circle from "../../primitives/Circle"
import Cone from "../../primitives/Cone"
import Cube from "../../primitives/Cube"
import Cylinder from "../../primitives/Cylinder"
import Octahedron from "../../primitives/Octahedron"
import Plane from "../../primitives/Plane"
import Sphere from "../../primitives/Sphere"
import Tetrahedron from "../../primitives/Tetrahedron"
import Torus from "../../primitives/Torus"
import Scene from "../../Scene"
import Camera from "../../cameras/Camera"
import AmbientLight from "../../lights/AmbientLight"
import AreaLight from "../../lights/AreaLight"
import DirectionalLight from "../../lights/DirectionalLight"
import SkyLight from "../../lights/SkyLight"
import PointLight from "../../lights/PointLight"
import SpotLight from "../../lights/SpotLight"
import Group from "../../Group"
import { GameObjectType } from "./types"
import { type } from "@lincode/utils"

const record = type<Record<GameObjectType, () => ObjectManager>>({
    "group": () => new Group(),
    "model": () => new Model(),
    "svgMesh": () => new SvgMesh(),
    "sprite": () => new Sprite(),
    "reflector": () => new Reflector(),
    "scene": () => new Scene(),
    "camera": () => new Camera(),
    "ambientLight": () => new AmbientLight(),
    "areaLight": () => new AreaLight(),
    "directionalLight": () => new DirectionalLight(),
    "skyLight": () => new SkyLight(),
    "pointLight": () => new PointLight(),
    "spotLight": () => new SpotLight(),
    "circle": () => new Circle(),
    "cone": () => new Cone(),
    "cube": () => new Cube(),
    "cylinder": () => new Cylinder(),
    "octahedron": () => new Octahedron(),
    "plane": () => new Plane(),
    "sphere": () => new Sphere(),
    "tetrahedron": () => new Tetrahedron(),
    "torus": () => new Torus()
})

export default (type: GameObjectType) => record[type]()