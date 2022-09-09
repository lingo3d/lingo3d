import { Box3, BufferAttribute } from "three"
import { MeshBVH } from "three-mesh-bvh"
import code from "./workerString"
import { Queue } from "@lincode/promiselikes"

const queue = new Queue()

export class GenerateMeshBVHWorker {
    constructor() {
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

    async generate(geometry, options = {}) {
        await queue

        if (this.worker === null) {
            throw new Error("GenerateMeshBVHWorker: Worker has been disposed.")
        }

        const { worker } = this

        return new Promise((resolve, reject) => {
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

                    // we need to replace the arrays because they're neutered entirely by the
                    // webworker transfer.
                    geometry.attributes.position.array = position
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

            if (
                position.isInterleavedBufferAttribute ||
                (index && index.isInterleavedBufferAttribute)
            ) {
                throw new Error(
                    "GenerateMeshBVHWorker: InterleavedBufferAttribute are not supported for the geometry attributes."
                )
            }

            const transferrables = [position]
            if (index) {
                transferrables.push(index)
            }

            worker.postMessage(
                {
                    index,
                    position,
                    options: {
                        ...options,
                        onProgress: null,
                        includedProgressCallback: Boolean(options.onProgress),
                        groups: [...geometry.groups]
                    }
                },
                transferrables.map((arr) => arr.buffer)
            )
        })
    }

    dispose() {
        this.worker.terminate()
        this.worker = null
    }

    terminate() {
        console.warn(
            'GenerateMeshBVHWorker: "terminate" is deprecated. Use "dispose" instead.'
        )
        this.dispose()
    }
}
