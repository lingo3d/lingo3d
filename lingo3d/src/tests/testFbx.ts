import Model from "../display/Model"

export default {}

const model = new Model()
model.src = "gfxcard.glb"

model.loaded.then(loaded => {
    loaded.traverse((child) => {
        //@ts-ignore
        const { material } = child
        if (!material) return

        material.transparent = false
    })
})