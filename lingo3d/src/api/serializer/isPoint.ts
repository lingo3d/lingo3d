export const isPoint = (
    v: any,
    type = typeof v
): v is { x: number; y: number; z?: number } =>
    v && type === "object" && "x" in v && "y" in v
