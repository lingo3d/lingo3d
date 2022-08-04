import { Resolvable } from "@lincode/promiselikes"

export default <T>(promise: Promise<T>) => {
    const resolvable = new Resolvable<T>()
    promise.then((val) => {
        resolvable.resolve(val)
    })
    return resolvable
}
