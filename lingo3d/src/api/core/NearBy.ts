import { forceGetInstance } from "@lincode/utils"

class BB {
    public minX!: number
    public minY!: number
    public minZ!: number
    public maxX!: number
    public maxY!: number
    public maxZ!: number

    public constructor(
        x: number,
        y: number,
        z: number,
        width: number,
        height: number,
        depth: number
    ) {
        this.setFromCenterAndSize(x, y, z, width, height, depth)
    }

    public containsBox(box: BB) {
        return (
            this.minX <= box.minX &&
            box.maxX <= this.maxX &&
            this.minY <= box.minY &&
            box.maxY <= this.maxY &&
            this.minZ <= box.minZ &&
            box.maxZ <= this.maxZ
        )
    }

    public setFromCenterAndSize(
        x: number,
        y: number,
        z: number,
        width: number,
        height: number,
        depth: number
    ) {
        const halfWidth = width / 2
        const halfHeight = height / 2
        const halfDepth = depth / 2

        this.minX = x - halfWidth
        this.maxX = x + halfWidth
        this.minY = y - halfHeight
        this.maxY = y + halfHeight
        this.minZ = z - halfDepth
        this.maxZ = z + halfDepth
    }
}

class Obj {
    public binInfo = new Map<number, Map<number, Map<number, boolean>>>()

    public constructor(public id: number, public box: BB) {}
}

export default class NearBy {
    private limitBox: BB
    private bin = new Map<number, Map<number, Map<number, Map<Obj, boolean>>>>()
    private reusableResultMap = new Map()

    public constructor(
        width: number,
        height: number,
        depth: number,
        public binSize: number
    ) {
        this.limitBox = this.createBox(0, 0, 0, width, height, depth)
    }

    private createBox(
        x: number,
        y: number,
        z: number,
        width: number,
        height: number,
        depth: number
    ) {
        return new BB(x, y, z, width, height, depth)
    }

    // private createObject(id: number, box: BB) {
    //     return new Obj(id, box)
    // }

    private insert(obj: Obj) {
        if (!this.limitBox.containsBox(obj.box)) return

        const { binSize, bin } = this
        const { box, binInfo } = obj
        const { minX, minY, minZ, maxX, maxY, maxZ } = box

        let round = Math.round(minX / binSize) * binSize
        let minXLower, minXUpper
        if (round <= minX) {
            minXLower = round
            minXUpper = minXLower + binSize
        } else {
            minXUpper = round
            minXLower = round - binSize
        }

        round = Math.round(maxX / binSize) * binSize
        let maxXLower, maxXUpper
        if (round < maxX) {
            maxXLower = round
            maxXUpper = maxXLower + binSize
        } else {
            maxXUpper = round
            maxXLower = round - binSize
        }
        if (minXLower > maxXLower) {
            maxXLower = minXLower
        }

        round = Math.round(minY / binSize) * binSize
        let minYLower, minYUpper
        if (round <= minY) {
            minYLower = round
            minYUpper = minYLower + binSize
        } else {
            minYUpper = round
            minYLower = round - binSize
        }

        round = Math.round(maxY / binSize) * binSize
        let maxYLower, maxYUpper
        if (round < maxY) {
            maxYLower = round
            maxYUpper = maxYLower + binSize
        } else {
            maxYUpper = round
            maxYLower = round - binSize
        }
        if (minYLower > maxYLower) {
            maxYLower = minYLower
        }

        round = Math.round(minZ / binSize) * binSize
        let minZLower, minZUpper
        if (round <= minZ) {
            minZLower = round
            minZUpper = minZLower + binSize
        } else {
            minZUpper = round
            minZLower = round - binSize
        }

        round = Math.round(maxZ / binSize) * binSize
        let maxZLower, maxZUpper
        if (round < maxZ) {
            maxZLower = round
            maxZUpper = maxZLower + binSize
        } else {
            maxZUpper = round
            maxZLower = round - binSize
        }
        if (minZLower > maxZLower) {
            maxZLower = minZLower
        }

        for (let x = minXLower; x <= maxXLower; x += binSize) {
            const binXMap = forceGetInstance(
                bin,
                x,
                Map<number, Map<number, Map<Obj, boolean>>>
            )
            const binInfoXMap = forceGetInstance(
                binInfo,
                x,
                Map<number, Map<number, boolean>>
            )
            for (let y = minYLower; y <= maxYLower; y += binSize) {
                const binYMap = forceGetInstance(
                    binXMap,
                    y,
                    Map<number, Map<Obj, boolean>>
                )
                const binInfoYMap = forceGetInstance(
                    binInfoXMap,
                    y,
                    Map<number, boolean>
                )
                for (let z = minZLower; z <= maxZLower; z += binSize) {
                    forceGetInstance(binYMap, z, Map<Obj, boolean>).set(
                        obj,
                        true
                    )
                    binInfoYMap.set(z, true)
                }
            }
        }
    }

    private query(x: number, y: number, z: number) {
        const { binSize, bin } = this

        const rX = Math.round(x / binSize) * binSize
        const rY = Math.round(y / binSize) * binSize
        const rZ = Math.round(z / binSize) * binSize

        let minX, maxX
        if (rX <= x) {
            minX = rX
            maxX = rX + binSize
        } else {
            maxX = rX
            minX = rX - binSize
        }
        let minY, maxY
        if (rY <= y) {
            minY = rY
            maxY = rY + binSize
        } else {
            maxY = rY
            minY = rY - binSize
        }
        let minZ, maxZ
        if (rZ <= z) {
            minZ = rZ
            maxZ = rZ + binSize
        } else {
            maxZ = rZ
            minZ = rZ - binSize
        }

        const result = this.reusableResultMap
        result.clear()

        for (let xDiff = -binSize; xDiff <= binSize; xDiff += binSize) {
            const keyX = minX + xDiff
            const binX = bin.get(keyX)
            if (!binX) continue

            for (let yDiff = -binSize; yDiff <= binSize; yDiff += binSize) {
                const keyY = minY + yDiff
                const binY = binX.get(keyY)
                if (!binY) continue

                for (let zDiff = -binSize; zDiff <= binSize; zDiff += binSize) {
                    const keyZ = minZ + zDiff
                    const res = binY.get(keyZ)
                    if (!res) continue

                    for (let obj of res.keys()) result.set(obj, true)
                }
            }
        }
        return result
    }

    public delete(obj: Obj) {
        const { binInfo } = obj
        const { bin } = this

        for (let x of binInfo.keys()) {
            const binInfoX = binInfo.get(x)
            const binX = bin.get(x)
            if (!binInfoX || !binX) continue

            for (let y of binInfoX.keys()) {
                const binInfoY = binInfoX.get(y)
                const binY = binX.get(y)
                if (!binInfoY || !binY) continue

                for (let z of binInfoY.keys()) {
                    const binZ = binY.get(z)
                    if (!binZ) continue
                    binZ.delete(obj)
                    !binZ.size && binY.delete(z)
                    !binY.size && binX.delete(y)
                    !binX.size && bin.delete(x)
                }
            }
        }
        for (let x of binInfo.keys()) binInfo.delete(x)
    }

    public update(
        obj: Obj,
        x: number,
        y: number,
        z: number,
        width: number,
        height: number,
        depth: number
    ) {
        obj.box.setFromCenterAndSize(x, y, z, width, height, depth)
        this.delete(obj)
        this.insert(obj)
    }
}
