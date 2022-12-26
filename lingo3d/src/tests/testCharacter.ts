import { Point3d } from "@lincode/math"
import Character from "../display/Character"
import Cube from "../display/primitives/Cube"

// const character = new Character()
// character.src = "player2.glb"

const box = new Cube()
box.lookTo(new Point3d(100, 100, 100), 0.05)