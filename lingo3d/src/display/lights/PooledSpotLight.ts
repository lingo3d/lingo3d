import { spotLightPool } from "../../pools/objectPools/spotLightPool"
import IPooledSpotLight, {
    pooledSpotLightDefaults,
    pooledSpotLightSchema
} from "../../interface/IPooledSpotLight"
import SpotLight from "./SpotLight"
import PooledPointLightBase from "../core/PooledPointLightBase"
import { pooledSpotLightSystem } from "../../systems/pooledSpotLightSystem"
import { createEffect } from "@lincode/reactivity"
import {
    getSpotLightPoolEnabled,
    setSpotLightPoolEnabled
} from "../../states/useSpotLightPoolEnabled"
import { spotLightPoolPtr } from "../../pointers/spotLightPoolPtr"
import { getSpotLightPool } from "../../states/useSpotLightPool"

createEffect(() => {
    if (!getSpotLightPoolEnabled()) return

    for (let i = 0; i < spotLightPoolPtr[0]; ++i)
        spotLightPool.release(spotLightPool.request([], ""))

    return () => {
        spotLightPool.clear()
    }
}, [getSpotLightPool, getSpotLightPoolEnabled])

export default class PooledSpotLight
    extends PooledPointLightBase<SpotLight>
    implements IPooledSpotLight
{
    public static componentName = "pooledSpotLight"
    public static defaults = pooledSpotLightDefaults
    public static schema = pooledSpotLightSchema

    public constructor() {
        super()
        pooledSpotLightSystem.add(this)
        setSpotLightPoolEnabled(true)
    }

    private _angle = 45
    public get angle() {
        return this._angle
    }
    public set angle(value) {
        this._angle = value
        if (this.$light) this.$light.angle = value
    }

    private _penumbra = 0.2
    public get penumbra() {
        return this._penumbra
    }
    public set penumbra(value) {
        this._penumbra = value
        if (this.$light) this.$light.penumbra = value
    }

    private _volumetric = false
    public get volumetric() {
        return this._volumetric
    }
    public set volumetric(value) {
        this._volumetric = value
        if (this.$light) this.$light.volumetric = value
    }

    private _volumetricDistance = 1
    public get volumetricDistance() {
        return this._volumetricDistance
    }
    public set volumetricDistance(value) {
        this._volumetricDistance = value
        if (this.$light) this.$light.volumetricDistance = value
    }
}
