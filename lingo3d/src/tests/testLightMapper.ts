import { createEffect } from "@lincode/reactivity"
import * as THREE from "three"
//@ts-ignore
import { ProgressiveLightMap } from "three/examples/jsm/misc/ProgressiveLightMap"
import Octahedron from "../display/primitives/Octahedron"
import Plane from "../display/primitives/Plane"
import { onBeforeRender } from "../events/onBeforeRender"
import { getCameraRendered } from "../states/useCameraRendered"
import { getRenderer } from "../states/useRenderer"

// ShadowMap + LightMap Res and Number of Directional Lights
const shadowMapRes = 512,
    lightMapRes = 1024,
    lightCount = 8
let object: any = new THREE.Mesh(),
    lightOrigin: any = null
const dirLights: any = [],
    lightmapObjects: any = []

const blurEdges = true
const blendWindow = 200
const lightRadius = 50
const ambientWeight = 0.5

// directional lighting "origin"
lightOrigin = new THREE.Group()
lightOrigin.position.set(60, 150, 100)

// create 8 directional lights to speed up the convergence
for (let l = 0; l < lightCount; l++) {
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0 / lightCount)
    dirLight.name = "Dir. Light " + l
    dirLight.position.set(200, 200, 200)
    dirLight.castShadow = true
    // dirLight.shadow.camera.near = 100
    // dirLight.shadow.camera.far = 5000
    dirLight.shadow.camera.right = 150
    dirLight.shadow.camera.left = -150
    dirLight.shadow.camera.top = 150
    dirLight.shadow.camera.bottom = -150
    dirLight.shadow.mapSize.width = shadowMapRes
    dirLight.shadow.mapSize.height = shadowMapRes
    lightmapObjects.push(dirLight)
    dirLights.push(dirLight)
}

const ground = new Plane()
ground.rotationX = 270
ground.scale = 100
ground.y = -50

const groundMesh = ground.object3d

// const groundMesh = new THREE.Mesh(
//     new THREE.PlaneGeometry(999 * scaleDown, 999 * scaleDown),
//     new THREE.MeshStandardMaterial({ color: 0xffffff, depthWrite: true })
// )
lightmapObjects.push(groundMesh)

object = new Octahedron().object3d
object.traverse(function (child: any) {
    if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial()
        lightmapObjects.push(child)
    }
})

const lightTarget = new THREE.Group()
lightTarget.position.set(0, 20, 0)
for (let l = 0; l < dirLights.length; l++) {
    dirLights[l].target = lightTarget
}

object.add(lightTarget)

createEffect(() => {
    const renderer = getRenderer()
    if (!renderer) return

    const camera = getCameraRendered()

    const progressiveSurfacemap = new ProgressiveLightMap(renderer, lightMapRes)
    progressiveSurfacemap.addObjectsToLightMap(lightmapObjects)

    const handle = onBeforeRender(() => {
        progressiveSurfacemap.update(camera, blendWindow, blurEdges)

        if (!progressiveSurfacemap.firstUpdate)
            progressiveSurfacemap.showDebugLightmap(true)

        // Manually Update the Directional Lights
        for (let l = 0; l < dirLights.length; l++) {
            // Sometimes they will be sampled from the target direction
            // Sometimes they will be uniformly sampled from the upper hemisphere
            if (Math.random() > ambientWeight) {
                dirLights[l].position.set(
                    lightOrigin.position.x + Math.random() * lightRadius,
                    lightOrigin.position.y + Math.random() * lightRadius,
                    lightOrigin.position.z + Math.random() * lightRadius
                )
            } else {
                // Uniform Hemispherical Surface Distribution for Ambient Occlusion
                const lambda = Math.acos(2 * Math.random() - 1) - 3.14159 / 2.0
                const phi = 2 * 3.14159 * Math.random()
                dirLights[l].position.set(
                    Math.cos(lambda) * Math.cos(phi) * 300 + object.position.x,
                    Math.abs(Math.cos(lambda) * Math.sin(phi) * 300) +
                        object.position.y +
                        20,
                    Math.sin(lambda) * 300 + object.position.z
                )
            }
        }
    })
    return () => {
        handle.cancel()
    }
}, [getRenderer, getCameraRendered])
