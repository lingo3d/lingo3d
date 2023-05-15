import { assert, forceGet, forceGetInstance, random } from "@lincode/utils"
import Appendable from "../display/core/Appendable"
import MeshAppendable from "../display/core/MeshAppendable"
import deserialize from "../api/serializer/deserialize"
import settings from "../api/settings"
import spawn from "../api/spawn"
import Dummy from "../display/Dummy"
import Group from "../display/Group"
import Model from "../display/Model"

// const dummy = new Dummy()
// dummy.roughnessFactor = 0.4
// dummy.metalnessFactor = 1.5
// dummy.envFactor = 1.5
// dummy.scale = 5

// settings.environment = "studio"
// settings.defaultLight = false

settings.skybox = "day"
settings.ssr = true

const scale = 10

const [turnTemplate, straightTemplate, sideWalkTemplate] = deserialize([
    {
        type: "template",
        source: "group",
        uuid: "T5d3cWoQw4yJAI55Sw4gp",
        id: "turn",
        name: "turn",
        scaleX: scale,
        scaleY: scale,
        scaleZ: scale,
        innerY: 45.9,
        children: [
            {
                type: "cube",
                uuid: "NSd69ZcVTi3yiaid1E1e3",
                x: 0.07,
                y: -48.01,
                z: 0.31,
                scaleX: 1.46,
                scaleY: 0.12,
                scaleZ: 1.49,
                texture: "road/sideWalk.png",
                roughness: 0.52
            },
            {
                type: "model",
                uuid: "DSfr0GqKalQmVpzkqqT4t",
                y: 7.51,
                src: "road/turn.glb"
            }
        ]
    },
    {
        type: "template",
        source: "group",
        uuid: "-fiDbm6b-ArJf1SM4Z6DF",
        id: "straight",
        name: "straight",
        scaleX: scale,
        scaleY: scale,
        scaleZ: scale,
        z: 148.57,
        innerY: 46.88,
        innerRotationY: 90,
        children: [
            {
                type: "cube",
                uuid: "VRctNqlqmqqne4dlldSeY",
                x: 0.07,
                y: -48.66,
                z: -0.35,
                scaleX: 1.46,
                scaleY: 0.12,
                scaleZ: 1.49,
                texture: "road/sideWalk.png",
                roughness: 0.52
            },
            {
                type: "model",
                uuid: "YPYFEFJOzStKOf06jg9xb",
                y: 6.99,
                z: -0.19,
                scaleZ: 0.7,
                src: "road/straight.glb"
            }
        ]
    },
    {
        type: "template",
        source: "cube",
        uuid: "7YzzDpmyGQu2iMQ_KpzZe",
        id: "sideWalk",
        name: "sideWalk",
        z: -148.58,
        scaleX: 1.46 * scale,
        scaleY: 0.12 * scale,
        scaleZ: 1.49 * scale,
        innerY: -18.7,
        texture: "road/sideWalk.png",
        roughness: 0.52
    }
]) as Array<Appendable>

const sideWalk = 0
const road = 1

type Tile = {
    "-x": number
    "+x": number
    "-z": number
    "+z": number
}

type TileData = [Tile, Appendable, number]

const tiles = {
    sideWalkTile: [
        {
            "-x": sideWalk,
            "+x": sideWalk,
            "-z": sideWalk,
            "+z": sideWalk
        },
        sideWalkTemplate,
        0
    ],
    straightTile: [
        {
            "-x": road,
            "+x": road,
            "-z": sideWalk,
            "+z": sideWalk
        },
        straightTemplate,
        0
    ],
    turnTile: [
        {
            "-x": road,
            "+x": sideWalk,
            "-z": road,
            "+z": sideWalk
        },
        turnTemplate,
        0
    ]
} satisfies Record<string, TileData>

const rotateTile = ([tile, manager, angle]: TileData): TileData => {
    return [
        {
            "-x": tile["-z"],
            "-z": tile["+x"],
            "+x": tile["+z"],
            "+z": tile["-x"]
        },
        manager,
        angle - 90
    ]
}

const tileArray: Array<TileData> = []
for (let tile of Object.values(tiles)) {
    tileArray.push(tile)
    tileArray.push((tile = rotateTile(tile)))
    tileArray.push((tile = rotateTile(tile)))
    tileArray.push((tile = rotateTile(tile)))
}

const xMap = new Map<number, Map<number, Set<TileData>>>()
const tilesPositionMap = new Map<Set<TileData>, [number, number]>()
const getTiles = (x: number, y: number) => {
    const yMap = forceGetInstance(xMap, x, Map<number, Set<TileData>>)
    return forceGet(yMap, y, () => {
        const tiles = new Set(tileArray)
        tilesPositionMap.set(tiles, [x, y])
        return tiles
    })
}

const size = 10
const outOfBounds = (x: number, z: number) =>
    x < -size || x > size || z < -size || z > size

const offset = 146 * scale

const collapsed = new WeakSet<Set<TileData>>()

const allocate = (x: number, z: number) => {
    const tilesCenter = getTiles(x, z)
    const tilesTop = getTiles(x, z + 1)
    const tilesBottom = getTiles(x, z - 1)
    const tilesLeft = getTiles(x - 1, z)
    const tilesRight = getTiles(x + 1, z)

    return [tilesCenter, tilesTop, tilesBottom, tilesLeft, tilesRight]
}

const collapse = async (x: number, z: number) => {
    await new Promise((resolve) => setTimeout(resolve))

    const [tilesCenter, tilesTop, tilesBottom, tilesLeft, tilesRight] =
        allocate(x, z)

    const [tile, tileTemplate, tileAngle] = tilesCenter.size
        ? [...tilesCenter][Math.round(random(0, tilesCenter.size - 1))]
        : tiles.sideWalkTile
    const manager = spawn(tileTemplate) as Group
    manager.rotationY = tileAngle
    manager.x = x * offset
    manager.z = z * offset
    tilesCenter.clear()
    collapsed.add(tilesCenter)
    tilesPositionMap.delete(tilesCenter)

    for (const tileBottom of tilesBottom)
        if (tile["+z"] !== tileBottom[0]["-z"]) tilesBottom.delete(tileBottom)
    for (const tileTop of tilesTop)
        if (tile["-z"] !== tileTop[0]["+z"]) tilesTop.delete(tileTop)
    for (const tileLeft of tilesLeft)
        if (tile["-x"] !== tileLeft[0]["+x"]) tilesLeft.delete(tileLeft)
    for (const tileRight of tilesRight)
        if (tile["+x"] !== tileRight[0]["-x"]) tilesRight.delete(tileRight)

    let tilesMin: Set<TileData> | undefined
    for (const tiles of [tilesTop, tilesBottom, tilesLeft, tilesRight]) {
        if (!tilesPositionMap.has(tiles)) continue
        const [xNext, zNext] = tilesPositionMap.get(tiles)!
        if (outOfBounds(xNext, zNext)) {
            tilesPositionMap.delete(tiles)
            continue
        }
        if (tiles.size < (tilesMin?.size ?? Infinity)) tilesMin = tiles
    }
    if (!tilesMin) return
    const [xNext, yNext] = tilesPositionMap.get(tilesMin)!
    await collapse(xNext, yNext)
}
;(async () => {
    await collapse(0, 0)
    while (tilesPositionMap.size) {
        const [[x, z]] = tilesPositionMap.values()
        await collapse(x, z)
    }
})()
