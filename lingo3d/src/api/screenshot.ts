import { onAfterRender } from "../events/onAfterRender"
import { rendererPtr } from "../pointers/rendererPtr"

export default {
    toBlob: async () => {
        return new Promise<Blob>((resolve) => {
            onAfterRender(() => {
                rendererPtr[0].domElement.toBlob(
                    (blob) => blob && resolve(blob)
                )
            }, true)
        })
    },
    toDataURL: async (type?: string, quality?: any) => {
        return new Promise<string>((resolve) => {
            onAfterRender(() => {
                resolve(rendererPtr[0].domElement.toDataURL(type, quality))
            }, true)
        })
    }
}
