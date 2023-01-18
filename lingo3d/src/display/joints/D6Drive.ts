import { Reactive } from "@lincode/reactivity"
import Appendable from "../../api/core/Appendable"
import ID6Drive from "../../interface/ID6Drive"
import { getPhysXLoaded } from "../../states/usePhysXLoaded"
import sanitizeNumber from "../../utils/sanitizeNumber"
import destroy from "../core/PhysicsObjectManager/physx/destroy"
import { physxPtr } from "../core/PhysicsObjectManager/physx/physxPtr"

export default class D6Drive extends Appendable implements ID6Drive {
    private refreshState = new Reactive({})
    public driveState = new Reactive<any>(undefined)

    public constructor() {
        super()
        this.createEffect(() => {
            const { PxD6JointDrive } = physxPtr[0]
            if (!PxD6JointDrive) return

            const drive = PxD6JointDrive(
                this.stiffness,
                this.damping,
                sanitizeNumber(this.forceLimit),
                this.isAcceleration
            )
            this.driveState.set(drive)

            return () => {
                this.driveState.set(undefined)
                destroy(drive)
            }
        }, [getPhysXLoaded, this.refreshState.get])
    }

    private _stiffness?: number
    public get stiffness() {
        return this._stiffness ?? 0
    }
    public set stiffness(value) {
        this._stiffness = value
        this.refreshState.set({})
    }

    private _damping?: number
    public get damping() {
        return this._damping ?? 1000
    }
    public set damping(value) {
        this._damping = value
        this.refreshState.set({})
    }

    private _forceLimit?: number
    public get forceLimit() {
        return this._forceLimit ?? Infinity
    }
    public set forceLimit(value) {
        this._forceLimit = value
        this.refreshState.set({})
    }

    private _isAcceleration?: boolean
    public get isAcceleration() {
        return this._isAcceleration ?? false
    }
    public set isAcceleration(value) {
        this._isAcceleration = value
        this.refreshState.set({})
    }
}
