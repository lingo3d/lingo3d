import {
    DefaultSkyLight,
    Dummy,
    Model,
    ThirdPersonCamera,
    keyboard,
    settings
} from ".."
import { createEffect, store } from "@lincode/reactivity"
import axios from "redaxios"

settings.exposure = 0.5
settings.environment = "studio"
settings.bloom = true
settings.ssr = true
settings.ssao = true

const pub = new Model()
pub.src = "british_pub/scene.gltf"
pub.scale = 5
pub.physics = "map"

const light = new DefaultSkyLight()
light.shadows = false

const player = new Dummy()
player.x = 550.51
player.y = -71.13
player.z = -400.0
player.physics = "character"
player.roughnessFactor = 0
player.strideMove = true

const tommy = new Model()
tommy.src = "tommy/scene.gltf"
tommy.scale = 1.7
tommy.x = 493.49
tommy.y = -71.13
tommy.z = -228.82
tommy.rotationY = 45.0
tommy.rotationX = -180
tommy.rotationZ = -180

keyboard.onKeyPress = (ev) => {
    if (ev.keys.has("w")) {
        player.strideForward = -5
    } else if (ev.keys.has("s")) {
        player.strideForward = 5
    }
    if (canSpeak && ev.keys.has("Space")) setSpeaking(true)
}

keyboard.onKeyUp = (ev) => {
    player.strideForward = 0
    player.strideRight = 0

    if (!ev.keys.has("Space")) setSpeaking(false)
}

//camera
const cam = new ThirdPersonCamera()
cam.append(player)
cam.mouseControl = "drag"
cam.active = true
cam.innerZ = 150
cam.innerY = 50
cam.innerX = 50
cam.lockTargetRotation = "dynamic-lock"

let canSpeak = false
const [setSpeaking, getSpeaking] = store(false)

tommy.onLoop = () => {
    if (tommy.position.distanceTo(player.position) < 1) {
        canSpeak = true
    } else {
        canSpeak = false
    }
}

const selectedVoice = speechSynthesis
    .getVoices()
    .find((voice) => voice.name.includes("Albert"))

const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.voice = selectedVoice!
        speechSynthesis.speak(utterance)
    } else {
        console.error("Speech synthesis is not supported in this browser.")
    }
}

//@ts-ignore
const recognition = new window.webkitSpeechRecognition()
recognition.lang = "en-US"
recognition.continuous = true

const sendChat = async (text: string) => {
    const result = await axios.post("http://127.0.0.1:8000/chat", {
        name: "Roy Winterson",
        text
    })
    return result.data
}

recognition.onresult = async (event: any) => {
    let interimTranscript = ""
    let finalTranscript = ""

    for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
            finalTranscript += transcript + " "
        } else {
            interimTranscript += transcript
        }
    }
    console.log(finalTranscript)
    const result = await sendChat(finalTranscript)
    speakText(result)
}

recognition.onerror = (event: any) => {
    console.error("Speech recognition error occurred: ", event.error)
}

createEffect(() => {
    if (!getSpeaking()) return

    recognition.start()
    return () => {
        recognition.stop()
    }
}, [getSpeaking])
