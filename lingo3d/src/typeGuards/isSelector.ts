export const isSelector = (val: string) =>
    val[0] === "#" || (val[0] === "." && val[1] !== "/")
