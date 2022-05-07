import { onAfterRender } from "../events/onAfterRender"
import { getRenderer } from "../states/useRenderer"

export default {
    toBlob: async () => {
        return new Promise<Blob>(resolve => {
            const handle = onAfterRender(() => {
                handle.cancel()
                getRenderer().domElement.toBlob(blob => blob && resolve(blob))
            })
        })
    },
    toDataURL: async (type?: string, quality?: any) => {
        return new Promise<string>(resolve => {
            const handle = onAfterRender(() => {
                handle.cancel()
                resolve(getRenderer().domElement.toDataURL(type, quality))
            })
        })
    }
}