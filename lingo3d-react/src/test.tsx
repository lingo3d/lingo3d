import React, { useCallback, useRef, useState } from "react"
import { Camera, Cube, World, Model, Keyboard, Mouse, Skybox, Reticle, useSpring, useSpawn, useAnimation, Sphere, HTML, Find, types, FirstPersonCamera, Stats, LingoEditor } from "."
//@ts-ignore
import gunSrc from "../assets-local/gun.glb"
//@ts-ignore
import groundSrc from "../assets-local/ground.jpeg"
import type * as Lingo from "lingo3d"
//@ts-ignore
import skyboxSrc from "../assets-local/skybox.jpg"
import { createRoot } from "react-dom/client"
import { nanoid } from "nanoid"
//@ts-ignore
import gallerySrc from "../assets-local/gallery.glb"
//@ts-ignore
import hdrSrc from "../assets-local/env.hdr"

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

  return (
    <>
    <World bloom bloomStrength={0.5} bloomThreshold={0.9}>
      <Camera active mouseControl="drag" physics noTumble height={180} ref={setCamera}>
        <Model src={gunSrc} z={-50} x={25} scale={0.2} innerRotationY={-90}>
          {bullets.map(bullet => (
            <Sphere key={bullet.id} scale={0.5} physics ref={fire} color="red" />
          ))}
        </Model>
        <Controls camera={camera} onClick={() => spawnBullet()} />
      </Camera>
      <Cube width={9999} depth={9999} y={-180} texture={groundSrc} physics mass={0} textureRepeat={20} />
      <Cube y={500} z={-300} physics color="red" rotationY={rotationKeyframes} onMouseOver={() => setScale(2)} onMouseOut={() => setScale(1)} scale={scaleSpring}>
        <HTML>
          <div>hello world</div>
        </HTML>
      </Cube>
      <Skybox texture={skyboxSrc} />
      
    </World>
    <Reticle />
    <LingoEditor />
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



function App3() {
  const cubeRef = useRef<types.Cube>(null)
  const foundRef = useRef<any>()

  return (
    <World defaultOrbitControls defaultLight={hdrSrc} skybox={hdrSrc} ambientOcclusion bloom bloomStrength={0.2} bloomRadius={1} bloomThreshold={0.5}>
      <Model src={gallerySrc} scale={20} physics="map">
        <Find ref={foundRef} name="a5_CRN.a5_0">
          <HTML>
            <div style={{ color: "white" }}>hello world</div>
          </HTML>
          <Cube />
        </Find>
      </Model>
      <FirstPersonCamera active mouseControl>
        <Cube
         ref={cubeRef}
         x={503.56}
         y={-872.32}
         z={-200.00}
         physics="character"
         height={180}
         pbr
        />
      </FirstPersonCamera>
      <Keyboard
        onKeyPress={() => {
          cubeRef.current?.moveForward(-5)
        }}
      />
    </World>
  )
}



const root = createRoot(document.getElementById('app'));
root.render(<React.StrictMode><App2 /></React.StrictMode>);

// ReactDOM.render(<React.StrictMode><App /></React.StrictMode>, document.querySelector("#app"))