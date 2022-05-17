import { Circle } from ".."
//@ts-ignore
import imgSrc from "../../assets-local/long.png"
//@ts-ignore
import bgSrc from "../../assets-local/bg.jpg"
import settings from "../api/settings"

const bird = new Circle()
bird.texture = imgSrc

settings.texture = bgSrc