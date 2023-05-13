import { rendererPtr } from "../pointers/rendererPtr"
import { addAfterRenderSystem } from "../systems/configSystems/afterRenderSystem"

export default {
    toBlob: () =>
        new Promise<Blob>((resolve) =>
            addAfterRenderSystem(() =>
                rendererPtr[0].domElement.toBlob(
                    (blob) => blob && resolve(blob)
                )
            )
        ),
    toDataURL: (type?: string, quality?: any) =>
        new Promise<string>((resolve) =>
            addAfterRenderSystem(() =>
                resolve(rendererPtr[0].domElement.toDataURL(type, quality))
            )
        )
}
