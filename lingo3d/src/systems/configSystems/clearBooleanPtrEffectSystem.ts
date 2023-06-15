import createInternalSystem from "../utils/createInternalSystem"

export const clearBooleanPtrEffectSystem = createInternalSystem(
    "clearBooleanPtrEffectSystem",
    {
        effect: (ptr: [boolean] | Array<boolean>) => (ptr[0] = false),
        effectTicker: "afterRender"
    }
)
