import {
    DirectionalLight as ThreeDirectionalLight,
    OrthographicCamera as ThreeOrthographicCamera
} from "three"
import scene from "../../engine/scene"
import { onBeforeRender } from "../../events/onBeforeRender"
import IDirectionalLight, {
    directionalLightDefaults,
    directionalLightSchema
} from "../../interface/IDirectionalLight"
import { getCameraRendered } from "../../states/useCameraRendered"
import LightBase from "../core/LightBase"
import getWorldPosition from "../utils/getWorldPosition"
import { vec2Point } from "../utils/vec2Point"

export default class DirectionalLight
    extends LightBase<typeof ThreeDirectionalLight>
    implements IDirectionalLight
{
    public static componentName = "directionalLight"
    public static defaults = directionalLightDefaults
    public static schema = directionalLightSchema

    private shadowCamera: ThreeOrthographicCamera

    public constructor() {
        super(ThreeDirectionalLight)

        const light = this.light
        scene.add(light.target)
        this.then(() => scene.remove(light.target))

        this.shadowCamera = light.shadow.camera

        this.createEffect(() => {
            const cam = getCameraRendered()
            const handle = onBeforeRender(() => {
                const position = getWorldPosition(cam)
                light.position.copy(position).add(this.outerObject3d.position)
                light.target.position.copy(position).sub(this.outerObject3d.position)
            })
            return () => {
                handle.cancel()
            }
        }, [getCameraRendered])
    }

    public override getWorldPosition() {
        return vec2Point(getWorldPosition(this.outerObject3d))
    }
    
    private _shadowDistance = 500
    public get shadowDistance() {
        return this._shadowDistance
    }
    public set shadowDistance(val) {
        this._shadowDistance = val
        this.shadowCamera.zoom = 500 / val
        this.shadowCamera.updateProjectionMatrix()
    }
}
