var Nearby = function (width, height, depth, binSize) {
    this.limitBox = this.createBox(0, 0, 0, width, height, depth)
    this.binSize = binSize

    this.bin = new Map()

    this.reusableResultMap = new Map()
}

Nearby.prototype.createBox = function (x, y, z, width, height, depth) {
    var bb = {}

    bb.containsBox = function (box) {
        return (
            this.minX <= box.minX &&
            box.maxX <= this.maxX &&
            this.minY <= box.minY &&
            box.maxY <= this.maxY &&
            this.minZ <= box.minZ &&
            box.maxZ <= this.maxZ
        )
    }

    bb.setFromCenterAndSize = function (x, y, z, width, height, depth) {
        var halfWidth = width / 2
        var halfHeight = height / 2
        var halfDepth = depth / 2

        this.minX = x - halfWidth
        this.maxX = x + halfWidth
        this.minY = y - halfHeight
        this.maxY = y + halfHeight
        this.minZ = z - halfDepth
        this.maxZ = z + halfDepth
    }

    bb.setFromCenterAndSize(x, y, z, width, height, depth)

    return bb
}

Nearby.prototype.createObject = function (id, box) {
    var self = this

    var obj = {
        id: id,
        box: box,
        binInfo: new Map()
    }

    return obj
}

Nearby.prototype.insert = function (obj) {
    if (!this.limitBox.containsBox(obj.box)) {
        return
    }

    var BIN_SIZE = this.binSize

    var box = obj.box
    var minX = box.minX
    var minY = box.minY
    var minZ = box.minZ
    var maxX = box.maxX
    var maxY = box.maxY
    var maxZ = box.maxZ

    var round = Math.round(minX / BIN_SIZE) * BIN_SIZE
    var minXLower, minXUpper
    if (round <= minX) {
        minXLower = round
        minXUpper = minXLower + BIN_SIZE
    } else {
        minXUpper = round
        minXLower = round - BIN_SIZE
    }

    round = Math.round(maxX / BIN_SIZE) * BIN_SIZE
    var maxXLower, maxXUpper
    if (round < maxX) {
        maxXLower = round
        maxXUpper = maxXLower + BIN_SIZE
    } else {
        maxXUpper = round
        maxXLower = round - BIN_SIZE
    }
    if (minXLower > maxXLower) {
        maxXLower = minXLower
    }

    round = Math.round(minY / BIN_SIZE) * BIN_SIZE
    var minYLower, minYUpper
    if (round <= minY) {
        minYLower = round
        minYUpper = minYLower + BIN_SIZE
    } else {
        minYUpper = round
        minYLower = round - BIN_SIZE
    }

    round = Math.round(maxY / BIN_SIZE) * BIN_SIZE
    var maxYLower, maxYUpper
    if (round < maxY) {
        maxYLower = round
        maxYUpper = maxYLower + BIN_SIZE
    } else {
        maxYUpper = round
        maxYLower = round - BIN_SIZE
    }
    if (minYLower > maxYLower) {
        maxYLower = minYLower
    }

    round = Math.round(minZ / BIN_SIZE) * BIN_SIZE
    var minZLower, minZUpper
    if (round <= minZ) {
        minZLower = round
        minZUpper = minZLower + BIN_SIZE
    } else {
        minZUpper = round
        minZLower = round - BIN_SIZE
    }

    round = Math.round(maxZ / BIN_SIZE) * BIN_SIZE
    var maxZLower, maxZUpper
    if (round < maxZ) {
        maxZLower = round
        maxZUpper = maxZLower + BIN_SIZE
    } else {
        maxZUpper = round
        maxZLower = round - BIN_SIZE
    }
    if (minZLower > maxZLower) {
        maxZLower = minZLower
    }

    for (var x = minXLower; x <= maxXLower; x += BIN_SIZE) {
        if (!this.bin.has(x)) {
            this.bin.set(x, new Map())
        }
        if (!obj.binInfo.has(x)) {
            obj.binInfo.set(x, new Map())
        }
        for (var y = minYLower; y <= maxYLower; y += BIN_SIZE) {
            if (!this.bin.get(x).has(y)) {
                this.bin.get(x).set(y, new Map())
            }
            if (!obj.binInfo.get(x).has(y)) {
                obj.binInfo.get(x).set(y, new Map())
            }
            for (var z = minZLower; z <= maxZLower; z += BIN_SIZE) {
                if (!this.bin.get(x).get(y).has(z)) {
                    this.bin.get(x).get(y).set(z, new Map())
                }
                this.bin.get(x).get(y).get(z).set(obj, true)

                obj.binInfo.get(x).get(y).set(z, true)
            }
        }
    }
}

Nearby.prototype.query = function (x, y, z) {
    var BIN_SIZE = this.binSize

    var rX = Math.round(x / BIN_SIZE) * BIN_SIZE
    var rY = Math.round(y / BIN_SIZE) * BIN_SIZE
    var rZ = Math.round(z / BIN_SIZE) * BIN_SIZE

    var minX, maxX
    if (rX <= x) {
        minX = rX
        maxX = rX + BIN_SIZE
    } else {
        maxX = rX
        minX = rX - BIN_SIZE
    }
    var minY, maxY
    if (rY <= y) {
        minY = rY
        maxY = rY + BIN_SIZE
    } else {
        maxY = rY
        minY = rY - BIN_SIZE
    }
    var minZ, maxZ
    if (rZ <= z) {
        minZ = rZ
        maxZ = rZ + BIN_SIZE
    } else {
        maxZ = rZ
        minZ = rZ - BIN_SIZE
    }

    var result = this.reusableResultMap
    result.clear()

    for (var xDiff = -BIN_SIZE; xDiff <= BIN_SIZE; xDiff += BIN_SIZE) {
        var keyX = minX + xDiff
        for (var yDiff = -BIN_SIZE; yDiff <= BIN_SIZE; yDiff += BIN_SIZE) {
            var keyY = minY + yDiff
            for (var zDiff = -BIN_SIZE; zDiff <= BIN_SIZE; zDiff += BIN_SIZE) {
                var keyZ = minZ + zDiff
                if (this.bin.has(keyX) && this.bin.get(keyX).has(keyY)) {
                    var res = this.bin.get(keyX).get(keyY).get(keyZ)
                    if (!res) continue

                    for (var obj of res.keys()) {
                        result.set(obj, true)
                    }
                }
            }
        }
    }

    return result
}

Nearby.prototype.delete = function (obj) {
    var binInfo = obj.binInfo

    for (var x of binInfo.keys()) {
        for (var y of binInfo.get(x).keys()) {
            for (var z of binInfo.get(x).get(y).keys()) {
                if (
                    this.bin.has(x) &&
                    this.bin.get(x).has(y) &&
                    this.bin.get(x).get(y).has(z)
                ) {
                    this.bin.get(x).get(y).get(z).delete(obj)
                    if (this.bin.get(x).get(y).get(z).size == 0) {
                        this.bin.get(x).get(y).delete(z)
                    }
                    if (this.bin.get(x).get(y).size == 0) {
                        this.bin.get(x).delete(y)
                    }
                    if (this.bin.get(x).size == 0) {
                        this.bin.delete(x)
                    }
                }
            }
        }
    }

    for (var x of binInfo.keys()) {
        binInfo.delete(x)
    }
}

Nearby.prototype.update = function (obj, x, y, z, width, height, depth) {
    obj.box.setFromCenterAndSize(x, y, z, width, height, depth)

    this.delete(obj)
    this.insert(obj)
}

export default Nearby
