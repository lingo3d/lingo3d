import { Reactive } from "@lincode/reactivity"
import Appendable from "../api/core/Appendable"

export default class SpawnNode extends Appendable {
    private refresh = new Reactive({})
    
    public constructor() {
        super()
        
        this.createEffect(() => {


        }, [this.refresh.get])
    }
}
