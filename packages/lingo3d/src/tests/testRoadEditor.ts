import { Vector3, CatmullRomCurve3, MeshLambertMaterial, MeshBasicMaterial, TubeBufferGeometry, Mesh } from "three"
import { Cube } from ".."
import scene from "../engine/scene"
//@ts-ignore
import roadSrc from "../../assets-local/road2.jpg"
import loadTexture from "../display/utils/loaders/loadTexture"

const controlPoints: Array<Cube> = []

const vecs = [
    new Vector3(-4, 0, -4),
    new Vector3(4, 0, -4),
    new Vector3(4, 0, 4),
    new Vector3(-4, 0, 4),
]

const sampleClosedSpline = new CatmullRomCurve3(vecs, true, "catmullrom")

const material = new MeshLambertMaterial({ color: 0xffffff, map: loadTexture(roadSrc) })

const wireframeMaterial = new MeshBasicMaterial({ color: 0x000000, opacity: 0.3, wireframe: true, transparent: true })

const geometry = new TubeBufferGeometry(sampleClosedSpline, 100, 1, 2, true)

const mesh = new Mesh(geometry, material)
const wireframe = new Mesh(geometry, wireframeMaterial)
mesh.add(wireframe)

scene.add(mesh)