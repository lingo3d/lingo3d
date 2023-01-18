import { Reactive } from "@lincode/reactivity"
import Appendable from "../../api/core/Appendable"
import ID6Drive from "../../interface/ID6Drive"

export default class D6Drive extends Appendable implements ID6Drive {
    public constructor() {
        super()
        this.createEffect(() => {
            
        }, [])
    }

    // private refreshState = new Reactive({})
    
    private _driveStiffness?: number

}

// driveStiffness
// driveDamping
// driveForceLimit
// isAcceleration