import { userlandNameSystemMap } from "../collections/userlandNameSystemMap"
import Appendable from "../display/core/Appendable"
import { scriptCompilingPtr } from "../pointers/scriptCompilingPtr"
import createInternalSystem from "./utils/createInternalSystem"

export const updateSystemsSystem = createInternalSystem("updateSystemsSystem", {
    data: {} as { names: Array<string> },
    update: (self: Appendable, data) => {
        if (scriptCompilingPtr[0]) return
        for (const name of data.names)
            userlandNameSystemMap.get(name)?.add(self)
        updateSystemsSystem.delete(self)
    }
})
