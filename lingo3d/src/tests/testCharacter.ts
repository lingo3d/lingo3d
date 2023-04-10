import Dummy from "../display/Dummy"

const player = new Dummy()
player.animationPaused = true
player.onLoad = () => {
    console.log("loaded")
}