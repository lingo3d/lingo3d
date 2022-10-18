import { onAfterRender } from "../events/onAfterRender"
import { getRenderer } from "../states/useRenderer"

export default {
    toBlob: async () => {
        return new Promise<Blob>((resolve) => {
            onAfterRender(() => {
                getRenderer()?.domElement.toBlob(
                    (blob) => blob && resolve(blob)
                )
            }, true)
        })
    },
    toDataURL: async (type?: string, quality?: any) => {
        return new Promise<string>((resolve) => {
            onAfterRender(() => {
                const renderer = getRenderer()
                renderer &&
                    resolve(renderer.domElement.toDataURL(type, quality))
            }, true)
        })
    }
}
