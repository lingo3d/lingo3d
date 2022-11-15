import { Point, Point3d } from "@lincode/math"

export const isPoint = (v: any, type = typeof v): v is Point | Point3d =>
    v && type === "object" && "x" in v && "y" in v
