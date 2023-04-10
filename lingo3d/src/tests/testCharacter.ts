import Dummy from "../display/Dummy"

const player = new Dummy()
player.onLoad = () => {
    console.log("loaded")
}