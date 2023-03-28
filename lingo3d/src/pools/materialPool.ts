import { Point } from "@lincode/math"
import { filter } from "@lincode/utils"
import { MeshStandardMaterial, DoubleSide, Vector2 } from "three"
import createMap from "../display/core/mixins/utils/createMap"
import filterNotDefault from "../display/core/mixins/utils/filterNotDefault"
import createInstancePool from "../display/core/utils/createInstancePool"

export type MaterialParams = [
    color: string,
    opacity: number,
    texture: string,
    alphaMap: string,
    textureRepeat: number | Point,
    textureFlipY: boolean,
    textureRotation: number,
    wireframe: boolean,
    envMap: string,
    envMapIntensity: number,
    aoMap: string,
    aoMapIntensity: number,
    bumpMap: string,
    bumpScale: number,
    displacementMap: string,
    displacementScale: number,
    displacementBias: number,
    emissive: boolean,
    emissiveIntensity: number,
    lightMap: string,
    lightMapIntensity: number,
    metalnessMap: string,
    metalness: number,
    roughnessMap: string,
    roughness: number,
    normalMap: string,
    normalScale: number,
    depthTest: boolean
]

export const [increaseMaterial, decreaseMaterial, allocateDefaultMaterial] =
    createInstancePool<MeshStandardMaterial, MaterialParams>(
        (params) =>
            new MeshStandardMaterial(
                filter(
                    {
                        side: DoubleSide,
                        color: params[0],
                        opacity: params[1],
                        transparent: params[1] !== undefined && params[1] < 1,
                        map: createMap(
                            params[2],
                            params[4],
                            params[5],
                            params[6]
                        ),
                        alphaMap: createMap(
                            params[3],
                            params[4],
                            params[5],
                            params[6]
                        ),
                        wireframe: params[7],
                        envMap: createMap(
                            params[8],
                            params[4],
                            params[5],
                            params[6]
                        ),
                        envMapIntensity: params[9],
                        aoMap: createMap(
                            params[10],
                            params[4],
                            params[5],
                            params[6]
                        ),
                        aoMapIntensity: params[11],
                        bumpMap: createMap(
                            params[12],
                            params[4],
                            params[5],
                            params[6]
                        ),
                        bumpScale: params[13],
                        displacementMap: createMap(
                            params[14],
                            params[4],
                            params[5],
                            params[6]
                        ),
                        displacementScale: params[15],
                        displacementBias: params[16],
                        emissive: params[17] ? params[0] : undefined,
                        emissiveIntensity: params[18],
                        lightMap: createMap(
                            params[19],
                            params[4],
                            params[5],
                            params[6]
                        ),
                        lightMapIntensity: params[20],
                        metalnessMap: createMap(
                            params[21],
                            params[4],
                            params[5],
                            params[6]
                        ),
                        metalness: params[22],
                        roughnessMap: createMap(
                            params[23],
                            params[4],
                            params[5],
                            params[6]
                        ),
                        roughness: params[24],
                        normalMap: createMap(
                            params[25],
                            params[4],
                            params[5],
                            params[6]
                        ),
                        normalScale: new Vector2(params[26], params[26]),
                        depthTest: params[27]
                    },
                    filterNotDefault
                )
            ),
        (material) => material.dispose()
    )
