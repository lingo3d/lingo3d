type Callable<Args extends Array<any>> = ((...args: Args) => void) | Args | boolean
export default Callable