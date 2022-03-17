import { isMultipleSelectionGroup, toFixed } from "./utils"

export const programmaticChangePtr = [false]

export default (t: any, xName: string, yName: string, zName: string, folder: string) => {
    return [{ x: toFixed(t[xName]), y: toFixed(t[yName]), z: toFixed(t[zName]) }, {
        folder,
        onChange: ({ last, value: { x, y, z } }: any) => {
            if (programmaticChangePtr[0]) return

            Object.assign(t, { [xName]: x, [yName]: y, [zName]: z })
            
            if (!last) return

            if (isMultipleSelectionGroup(t))
                for (const child of t.outerObject3d.children) {
                    if (!child) continue
                    //do something with child
                }
            else {
                //do something with t
            }
        }
    }] as const
}