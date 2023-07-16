type Point = { x: number; y: number; z?: number }

export default (a: Point, b: Point) => a.x === b.x && a.y === b.y && a.z === b.z
