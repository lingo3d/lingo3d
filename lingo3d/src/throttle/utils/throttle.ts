export default <Result>(fn: () => Result, timeout: number) => {
    let scheduled = false
    let result: Result
    return () => {
        if (scheduled) return result
        scheduled = true
        setTimeout(() => (scheduled = false), timeout)
        return (result = fn())
    }
}
