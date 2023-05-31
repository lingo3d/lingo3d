import createSystem from "../utils/createSystem"

export const clearBooleanPtrEffectSystem = createSystem(
    "clearBooleanPtrAfterRenderSystem",
    {
        effect: (ptr: [boolean] | Array<boolean>) => (ptr[0] = false),
        effectTicker: "afterRender"
    }
)
