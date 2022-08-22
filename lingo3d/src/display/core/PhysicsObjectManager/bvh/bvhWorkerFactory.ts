let factory = () =>
    new Worker(new URL("./generateAsync.worker.js", import.meta.url), {
        type: "module"
    })

export const setBVHWorkerFactory = (workerFactory: () => Worker) =>
    (factory = workerFactory)

export const getBVHWorker = () => factory()
