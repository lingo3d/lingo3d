import { Box3, BufferAttribute, BufferGeometry } from "three"
import { MeshBVH } from "three-mesh-bvh"
import code from "./workerString"
import { Queue } from "@lincode/promiselikes"
import unsafeSetValue from "../../../../utils/unsafeSetValue"
import unsafeGetValue from "../../../../utils/unsafeGetValue"

const queue = new Queue()

export const geometryMeshMap = new WeakMap()

type Options = {
    onProgress?: (progress: number) => void
}

export class GenerateMeshBVHWorker {
    private worker: Worker | null

    public constructor() {
        const blob = new Blob([code], { type: "application/javascript" })
        this.worker = new Worker(URL.createObjectURL(blob))

        this.worker.onerror = (e) => {
            if (e.message) {
                throw new Error(
                    `GenerateMeshBVHWorker: Could not create Web Worker with error "${e.message}"`
                )
            } else {
                throw new Error(
                    "GenerateMeshBVHWorker: Could not create Web Worker."
                )
            }
        }
    }

    public async generate(geom: BufferGeometry, options: Options = {}) {
        await queue

        if (this.worker === null) {
            throw new Error("GenerateMeshBVHWorker: Worker has been disposed.")
        }

        const { worker } = this
        const geometry = geom.clone()
        geometry.dispose()

        return new Promise<MeshBVH>((resolve, reject) => {
            worker.onerror = (e) => {
                reject(new Error(`GenerateMeshBVHWorker: ${e.message}`))
                queue.resolve()
            }

            worker.onmessage = (e) => {
                const { data } = e

                if (data.error) {
                    reject(new Error(data.error))
                    queue.resolve()
                    worker.onmessage = null
                } else if (data.serialized) {
                    const { serialized, position } = data
                    const bvh = MeshBVH.deserialize(serialized, geometry, {
                        setIndex: false
                    })
                    const boundsOptions = Object.assign(
                        {
                            setBoundingBox: true
                        },
                        options
                    )

                    unsafeSetValue(
                        geometry.attributes.position,
                        "array",
                        position
                    )
                    if (geometry.index) {
                        geometry.index.array = serialized.index
                    } else {
                        const newIndex = new BufferAttribute(
                            serialized.index,
                            1,
                            false
                        )
                        geometry.setIndex(newIndex)
                    }

                    if (boundsOptions.setBoundingBox) {
                        geometry.boundingBox = bvh.getBoundingBox(new Box3())
                    }

                    resolve(bvh)
                    queue.resolve()
                    worker.onmessage = null
                } else if (options.onProgress) {
                    options.onProgress(data.progress)
                }
            }

            const index = geometry.index ? geometry.index.array : null
            const position = geometry.attributes.position.array

            const transferrables = [position]
            if (index) {
                transferrables.push(index)
            }

            worker.postMessage(
                {
                    index,
                    position,
                    matrixWorld: geometryMeshMap.get(geom).matrixWorld,
                    options: {
                        ...options,
                        onProgress: null,
                        includedProgressCallback: Boolean(options.onProgress),
                        groups: [...geometry.groups]
                    }
                },
                transferrables.map((arr) => unsafeGetValue(arr, "buffer"))
            )
        })
    }

    dispose() {
        this.worker!.terminate()
        this.worker = null
    }

    terminate() {
        console.warn(
            'GenerateMeshBVHWorker: "terminate" is deprecated. Use "dispose" instead.'
        )
        this.dispose()
    }
}
