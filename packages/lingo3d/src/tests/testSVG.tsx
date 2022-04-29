//@ts-ignore
import textSrc from "../../assets-local/text.svg"
//@ts-ignore
import text2Src from "../../assets-local/text2.svg"
import SvgMesh from "../display/SvgMesh"

const textMesh = new SvgMesh()
textMesh.src = textSrc

textMesh.color = "brown"
textMesh.bloom = true


const textMesh2 = new SvgMesh()
textMesh2.src = text2Src

textMesh2.color = "blue"
textMesh2.bloom = true