import store, { push, pull } from "@lincode/reactivity"

const [setBVHMap, getBVHMap] = store<Array<any>>([])
const pushBVHMap = push(setBVHMap, getBVHMap)
const pullBVHMap = pull(setBVHMap, getBVHMap)

export { pushBVHMap, pullBVHMap, getBVHMap }