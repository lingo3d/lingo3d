import {
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
    WebGLRenderer,
    WebGLRenderTarget
} from "three"
import Camera from "../display/cameras/Camera"
import Model from "../display/Model"
import Portal from "../display/Portal"
import Cube from "../display/primitives/Cube"
import scene from "../engine/scene"
import { onBeforeRender } from "../events/onBeforeRender"
import { rendererPtr } from "../states/useRenderer"

const map = new Model()
map.scale = 10
map.src = "cathedral.glb"

const portal = new Portal()
portal.width = 200
portal.height = 400

const target = new Cube()
target.x = 0
target.y = -400
target.z = 500
target.rotationY = 30