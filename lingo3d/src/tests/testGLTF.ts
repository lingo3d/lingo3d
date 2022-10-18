import settings from "../api/settings"
import Model from "../display/Model"

const model = new Model()
model.src = "nft/nft.gltf"
model.scale = 20
model.roughnessFactor = 0
settings.ssr = true