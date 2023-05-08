import { Point } from "@lincode/math"
import { filter } from "@lincode/utils"
import { SpriteMaterial, DoubleSide } from "three"
import createMap from "../display/core/mixins/utils/createMap"
import filterNotDefault from "../display/core/mixins/utils/filterNotDefault"
import createInstancePool from "./utils/createInstancePool"
import { Blending, ColorString } from "../interface/ITexturedStandard"
import { castBlending } from "../display/utils/castBlending"

export type SpriteMaterialParams = [
    color: ColorString,
    opacity: number,
    texture: string,
    alphaMap: string,
    textureRepeat: number | Point,
    textureFlipY: boolean,
    textureRotation: number,
    depthTest: boolean,
    blending: Blending
]

export const [increaseSpriteMaterial, decreaseSpriteMaterial] =
    createInstancePool<SpriteMaterial, SpriteMaterialParams>(
        (params) =>
            new SpriteMaterial(
                filter(
                    {
                        side: DoubleSide,
                        color: params[0],
                        opacity: params[1],
                        transparent: true,
                        // transparent: params[1] !== undefined && params[1] < 1,
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
                        depthTest: params[7],
                        blending: castBlending(params[8])
                    },
                    filterNotDefault
                )
            ),
        (material) => material.dispose()
    )
