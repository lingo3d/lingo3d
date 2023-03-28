import throttleSystem from "./throttleSystem"

export default throttleSystem((collection: Map<any, any> | Set<any>) =>
    collection.clear()
)
