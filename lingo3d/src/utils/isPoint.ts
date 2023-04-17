export type PointType = { x: number; y: number; z?: number }
export type Point3dType = { x: number; y: number; z: number }

export const isPoint = (v: any, type = typeof v): v is PointType =>
    v && type === "object" && "x" in v && "y" in v
