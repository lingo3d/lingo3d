import React, { useCallback, useState } from "react"
import { Camera, Cube, World, Model, Keyboard, Mouse, Skybox, Reticle, useSpring, useSpawn, useAnimation, Editor, Sphere, HTML, Sound } from "."
//@ts-ignore
import gunSrc from "../assets-local/gun.glb"
//@ts-ignore
import groundSrc from "../assets-local/ground.jpeg"
import type * as Lingo from "lingo3d"
//@ts-ignore
import skyboxSrc from "../assets-local/skybox.jpg"
import ThirdPersonCamera from "./components/display/cameras/ThirdPersonCamera"
import useKeyboard from "./hooks/useKeyboard"
import { createRoot } from "react-dom/client"
import ReactDOM from "react-dom"
import useTimer from "./hooks/useTimer"
import { nanoid } from "nanoid"
import { Stats } from "."
//@ts-ignore
import gunshotSrc from "../assets-local/gunshot.wav"
//@ts-ignore
import musicSrc from "../assets-local/music.mp3"
import useSound from "./hooks/useSound"

const Controls: React.FC<{ camera?: Lingo.Camera, onClick: () => void }> = ({ camera, onClick }) => {
  if (!camera) return null

  return <>
    <Keyboard
      onKeyPress={key => {
        if (key === "w")
          camera.moveForward(10)
        if (key === "s")
          camera.moveForward(-10)
        if (key === "a")
          camera.moveRight(-10)
        if (key === "d")
          camera.moveRight(10)
      }}
      onKeyDown={key => {
      if (key === " ") {
        camera.velocity.y = 10
      }
      }}
    />
    <Mouse onClick={onClick} />
  </>
}

const App = () => {
  const [camera, setCamera] = useState<Lingo.Camera>()
  const [bullets, spawnBullet] = useSpawn({ lifetime: 1000 })

  const fire = useCallback((bullet: Lingo.Cube) => bullet.applyLocalImpulse(0, 0, -1), [])

  const [scale, setScale] = useState(1)
  const scaleSpring = useSpring(scale)
  const rotationKeyframes = useAnimation({ from: 0, to: 360, duration: 5000 })

  const sound = useSound(gunshotSrc)

  return (
    <>
    <World bloom bloomStrength={0.5} bloomThreshold={0.9}>
      <Camera active mouseControl physics noTumble height={180} ref={setCamera}>
        <Model src={gunSrc} z={-50} x={25} scale={0.2} innerRotationY={-90}>
          {bullets.map(bullet => (
            <Sphere key={bullet.id} scale={0.5} physics ref={fire} color="red" />
          ))}
        </Model>
        <Controls camera={camera} onClick={() => (spawnBullet(), sound.play())} />
      </Camera>
      <Cube width={9999} depth={9999} y={-180} texture={groundSrc} physics mass={0} textureRepeat={20} />
      <Cube y={500} z={-300} physics color="red" rotationY={rotationKeyframes} onMouseOver={() => setScale(2)} onMouseOut={() => setScale(1)} scale={scaleSpring}>
        <HTML>
          <div>hello world</div>
        </HTML>
      </Cube>
      <Skybox texture={skyboxSrc} />
      <Sound src={musicSrc} autoplay />
    </World>
    <Reticle />
    <Stats mode="fps" />
    </>
  )
}

const App2 = () => {
  const [userData, setUserData] = useState<any>([])

  const pushUserData = () => {
    setUserData([...userData, { name: nanoid() }])
  }

  const pullUserData = () => {
    userData.pop()
    setUserData([...userData])
  }

  return (<>
    <World>
        {userData.map(user => (
          <Cube key={user.name} physics y={500} color="red">
              <HTML>
                <div style={{ color: "yellow" }}>hello world, HTML!</div> 
              </HTML>
          </Cube>
        ))}
        <Cube y={-200} width={999} depth={999} color="blue" physics mass={0} />
    </World>
    <div style={{ position: "absolute", marginTop: 100 }}>
      <button onClick={pushUserData}>
        add user
      </button>
      <button onClick={pullUserData}>
        remove user
      </button>
    </div>
    <Stats mode="fps" />
  </>)
}

const root = createRoot(document.getElementById('app'));
root.render(<React.StrictMode><App /></React.StrictMode>);

// ReactDOM.render(<React.StrictMode><App /></React.StrictMode>, document.querySelector("#app"))