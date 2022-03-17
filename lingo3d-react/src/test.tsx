import React, { useCallback, useState } from "react"
import ReactDOM from "react-dom"
import { Camera, Cube, World, Model, Keyboard, Mouse, Skybox, Reticle, useSpring, useSpawn, useAnimation, Editor } from "."
//@ts-ignore
import gunSrc from "../assets-local/gun.glb"
//@ts-ignore
import groundSrc from "../assets-local/ground.jpeg"
import type * as Lingo from "lingo3d"
//@ts-ignore
import skyboxSrc from "../assets-local/skybox.jpg"
import ThirdPersonCamera from "./components/display/cameras/ThirdPersonCamera"

const Controls: React.FC<{ camera: Lingo.Camera, onClick: () => void }> = ({ camera, onClick }) => {
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
        camera.applyImpulse(0, 10, 0)
      }
      }}
    />
    <Mouse onClick={onClick} />
  </>
}

const App = () => {
  const [camera, setCamera] = useState<Lingo.Camera>()
  const [bulletFactory, spawnBullet] = useSpawn({ lifetime: 1000 })

  const fire = useCallback((bullet: Lingo.Cube) => bullet.applyLocalImpulse(0, 0, -100), [])

  const [scale, setScale] = useState(1)
  const scaleSpring = useSpring(scale)
  const rotationKeyframes = useAnimation({ from: 0, to: 360, repeat: Infinity, duration: 5000 })

  return (
    <>
    <World bloom bloomStrength={0.5} bloomThreshold={0.9}>
      <Camera active mouseControl physics noTumble height={180} ref={setCamera}>
        <Model src={gunSrc} z={-50} x={25} scale={0.2} innerRotationY={-90}>
          {bulletFactory(bullet => (
            <Cube key={bullet.id} scale={0.5} physics ref={fire} />
          ))}
        </Model>
        <Controls camera={camera} onClick={spawnBullet} />
      </Camera>
      <Cube width={9999} depth={9999} y={-180} texture={groundSrc} physics mass={0} textureRepeat={20} />
      <Cube y={500} z={-300} physics color="red" rotationY={rotationKeyframes} onMouseOver={() => setScale(2)} onMouseOut={() => setScale(1)} scale={scaleSpring} />
      <Skybox texture={skyboxSrc} />
    </World>
    <Reticle />
    </>
  )
}

const App2 = () => {
  return (<>
    <World>
      <ThirdPersonCamera active>
        <Cube />
      </ThirdPersonCamera>
    </World>
    <Editor />
  </>)
}

ReactDOM.render(<App2 />, document.querySelector("#app"))