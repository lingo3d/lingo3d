import CharacterRig from "../display/CharacterRig"
import Model from "../display/Model"
import { configCharacterRigAnimationSystem } from "../systems/configLoadedSystems/configCharacterRigAnimationSystem"

const dummy = new Model()
dummy.src = "Running.fbx"
dummy.x = 50
dummy.y = 85
dummy.animation = true
// dummy.remove()

const model = new Model()
model.src = "player2.glb"
model.scale = 1.7
model.y = 85

const rig = new CharacterRig()
rig.attach(model)

configCharacterRigAnimationSystem.add(rig, { target: dummy })
