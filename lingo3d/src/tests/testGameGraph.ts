import { forceGet, forceGetInstance, random } from "@lincode/utils"
import MeshAppendable from "../api/core/MeshAppendable"
import deserialize from "../api/serializer/deserialize"
import settings from "../api/settings"
import Dummy from "../display/Dummy"
import Model from "../display/Model"

const templates = deserialize([
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
])

console.log(templates)

// const dummy = new Dummy()
// dummy.roughnessFactor = 0.4
// dummy.metalnessFactor = 1.5
// dummy.envFactor = 1.5
// dummy.scale = 5

// settings.environment = "studio"
// settings.defaultLight = false

// const sideWalk = new Model()
// sideWalk.src = "road/sideWalk.glb"
// sideWalk.resize = false

// const sideWalk = 0
// const road = 1

// type Tile = {
//     "-x": number
//     "+x": number
//     "-z": number
//     "+z": number
// }

// const tiles = {
//     sideWalkTile: {
//         "-x": sideWalk,
//         "+x": sideWalk,
//         "-z": sideWalk,
//         "+z": sideWalk
//     },
//     straightTile: {
//         "-x": road,
//         "+x": road,
//         "-z": sideWalk,
//         "+z": sideWalk
//     },
//     turnTile: {
//         "-x": road,
//         "+x": sideWalk,
//         "-z": road,
//         "+z": sideWalk
//     }
// }

// const rotateTile = (tile: any) => {
//     const newTile: any = {}
//     newTile["-x"] = tile["-z"]
//     newTile["-z"] = tile["+x"]
//     newTile["+x"] = tile["+z"]
//     newTile["+z"] = tile["-x"]
//     return newTile
// }

// const tileArray: Array<Tile> = []
// for (let tile of Object.values(tiles)) {
//     tileArray.push(tile)
//     tileArray.push((tile = rotateTile(tile)))
//     tileArray.push((tile = rotateTile(tile)))
//     tileArray.push((tile = rotateTile(tile)))
// }

// const xMap = new Map<number, Map<number, Set<Tile>>>()
// const tilesPositionMap = new WeakMap<Set<Tile>, [number, number]>()
// const getTiles = (x: number, y: number) => {
//     const yMap = forceGetInstance(xMap, x, Map<number, Set<Tile>>)
//     return forceGet(yMap, y, () => {
//         const tiles = new Set(tileArray)
//         tilesPositionMap.set(tiles, [x, y])
//         return tiles
//     })
// }

// const collapse = (x: number, y: number) => {
//     const tilesCenter = getTiles(x, y)
//     const tilesTop = getTiles(x, y + 1)
//     const tilesBottom = getTiles(x, y - 1)
//     const tilesLeft = getTiles(x - 1, y)
//     const tilesRight = getTiles(x + 1, y)

//     const tileCenter = [...tilesCenter][
//         Math.round(random(0, tilesCenter.size - 1))
//     ]
//     console.log(tileCenter, x, y)
//     tilesCenter.clear()
//     for (const tileBottom of tilesBottom)
//         if (tileCenter["+z"] !== tileBottom["-z"])
//             tilesBottom.delete(tileBottom)

//     for (const tileTop of tilesTop)
//         if (tileCenter["-z"] !== tileTop["+z"]) tilesTop.delete(tileTop)
//     for (const tileLeft of tilesLeft)
//         if (tileCenter["-x"] !== tileLeft["+x"]) tilesLeft.delete(tileLeft)
//     for (const tileRight of tilesRight)
//         if (tileCenter["+x"] !== tileRight["-x"]) tilesRight.delete(tileRight)

//     let tilesMin: Set<Tile> | undefined
//     for (const tiles of [tilesTop, tilesBottom, tilesLeft, tilesRight])
//         if (tiles.size && tiles.size < (tilesMin?.size ?? Infinity)) {
//             const [xNext, yNext] = tilesPositionMap.get(tiles)!
//             if (xNext < -50 || xNext > 50 || yNext < -50 || yNext > 50) continue
//             tilesMin = tiles
//         }
//     if (!tilesMin) return false

//     const [xNext, yNext] = tilesPositionMap.get(tilesMin)!
//     collapse(xNext, yNext)
//     return true
// }

// collapse(0, 0)

// console.log("done")
