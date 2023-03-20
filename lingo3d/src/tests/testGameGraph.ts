import { forceGet, forceGetInstance, random } from "@lincode/utils"
import Appendable from "../api/core/Appendable"
import MeshAppendable from "../api/core/MeshAppendable"
import deserialize from "../api/serializer/deserialize"
import settings from "../api/settings"
import spawn from "../api/spawn"
import Dummy from "../display/Dummy"
import Group from "../display/Group"
import Model from "../display/Model"

const [turnTemplate, straightTemplate, sideWalkTemplate] = deserialize([
    {
        type: "template",
        source: "group",
        uuid: "T5d3cWoQw4yJAI55Sw4gp",
        id: "turn",
        name: "turn",
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
        scaleX: 1.46,
        scaleY: 0.12,
        scaleZ: 1.49,
        innerY: -18.7,
        texture: "road/sideWalk.png",
        roughness: 0.52
    }
]) as Array<Appendable>

// const dummy = new Dummy()
// dummy.roughnessFactor = 0.4
// dummy.metalnessFactor = 1.5
// dummy.envFactor = 1.5
// dummy.scale = 5

// settings.environment = "studio"
// settings.defaultLight = false

const sideWalk = 0
const road = 1

type Tile = {
    "-x": number
    "+x": number
    "-z": number
    "+z": number
}

type TileTuple = [Tile, Appendable, number]

const tiles: Record<string, TileTuple> = {
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
}

const rotateTile = ([tile, manager, angle]: TileTuple): TileTuple => {
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

const tileArray: Array<TileTuple> = []
for (let tile of Object.values(tiles)) {
    tileArray.push(tile)
    tileArray.push((tile = rotateTile(tile)))
    tileArray.push((tile = rotateTile(tile)))
    tileArray.push((tile = rotateTile(tile)))
}

const xMap = new Map<number, Map<number, Set<TileTuple>>>()
const tilesPositionMap = new WeakMap<Set<TileTuple>, [number, number]>()
const getTiles = (x: number, y: number) => {
    const yMap = forceGetInstance(xMap, x, Map<number, Set<TileTuple>>)
    return forceGet(yMap, y, () => {
        const tiles = new Set(tileArray)
        tilesPositionMap.set(tiles, [x, y])
        return tiles
    })
}

const collapse = (x: number, z: number) => {
    const tilesCenter = getTiles(x, z)
    const tilesTop = getTiles(x, z + 1)
    const tilesBottom = getTiles(x, z - 1)
    const tilesLeft = getTiles(x - 1, z)
    const tilesRight = getTiles(x + 1, z)

    const [tile, tileTemplate, tileAngle] = [...tilesCenter][
        Math.round(random(0, tilesCenter.size - 1))
    ]
    const manager = spawn(tileTemplate) as Group
    manager.rotationY = tileAngle
    manager.x = x * 146
    manager.z = z * 146
    tilesCenter.clear()

    for (const tileBottom of tilesBottom)
        if (tile["+z"] !== tileBottom[0]["-z"]) tilesBottom.delete(tileBottom)
    for (const tileTop of tilesTop)
        if (tile["-z"] !== tileTop[0]["+z"]) tilesTop.delete(tileTop)
    for (const tileLeft of tilesLeft)
        if (tile["-x"] !== tileLeft[0]["+x"]) tilesLeft.delete(tileLeft)
    for (const tileRight of tilesRight)
        if (tile["+x"] !== tileRight[0]["-x"]) tilesRight.delete(tileRight)

    let tilesMin: Set<TileTuple> | undefined
    for (const tiles of [tilesTop, tilesBottom, tilesLeft, tilesRight])
        if (tiles.size && tiles.size < (tilesMin?.size ?? Infinity)) {
            const [xNext, yNext] = tilesPositionMap.get(tiles)!
            if (xNext < -50 || xNext > 50 || yNext < -50 || yNext > 50) continue
            tilesMin = tiles
        }
    if (!tilesMin) return false

    const [xNext, yNext] = tilesPositionMap.get(tilesMin)!
    collapse(xNext, yNext)
    return true
}

collapse(0, 0)

console.log("done")
