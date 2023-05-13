export default <Args extends Array<unknown>, Result>(
    fn: (...args: Args) => Result,
    timeout: number
) => {
    let scheduled = false
    let result: Result
    return (...args: Args) => {
        if (scheduled) return result
        scheduled = true
        setTimeout(() => (scheduled = false), timeout)
        return (result = fn(...args))
    }
}
