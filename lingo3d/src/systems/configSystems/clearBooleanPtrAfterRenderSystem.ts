import createSystem from "../utils/createSystem"

export const clearBooleanPtrAfterRenderSystem = createSystem(
    "clearBooleanPtrAfterRenderSystem",
    {
        effect: (ptr: [boolean] | Array<boolean>) => (ptr[0] = false),
        effectTicker: "afterRender"
    }
)
