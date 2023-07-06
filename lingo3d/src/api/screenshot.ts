import { onAfterRender } from "../events/onAfterRender"
import { rendererPtr } from "../pointers/rendererPtr"

export default {
    toBlob: () =>
        new Promise<Blob>((resolve) =>
            onAfterRender(
                () =>
                    rendererPtr[0].domElement.toBlob(
                        (blob) => blob && resolve(blob)
                    ),
                true
            )
        ),
    toDataURL: (type?: string, quality?: any) =>
        new Promise<string>((resolve) =>
            onAfterRender(
                () =>
                    resolve(rendererPtr[0].domElement.toDataURL(type, quality)),
                true
            )
        )
}
