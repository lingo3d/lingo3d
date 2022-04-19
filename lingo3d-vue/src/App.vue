<script setup lang="ts">
import { World, types } from "."
import Model from "./components/display/Model.vue"
import ThirdPersonCamera from "./components/display/cameras/ThirdPersonCamera.vue"
import Keyboard from "./components/api/Keyboard.vue"
import { ref } from "vue"
import Find from "./components/logical/Find.vue"
import HTML from "./components/logical/HTML/index.vue"

const model = ref<types.Model>()
const pose = ref("idle")
const mouseOver = ref(false)

const handleKeyPress = (key: string) => {
  if (key === "w") {
    model.value?.moveForward(-10)
    pose.value = "running"
  }
}
const handleKeyUp = () => {
  pose.value = "idle"
}

</script>

<template>
  <World default-light="env.hdr" skybox="env.hdr">
    <Model src="gallery.glb" :scale="20" physics="map">
      <Find
       name="a6_CRN.a6_0"
       @mouse-over="mouseOver = true"
       @mouse-out="mouseOver = false"
       :outline="mouseOver"
      >
        <HTML v-if="mouseOver">
          <div style="color: white">Hello World</div>
        </HTML>
      </Find>
    </Model>
    <ThirdPersonCamera active mouse-control>
      <Model
        src="bot.fbx"
        physics="character"
        ref="model"
        pbr
        box-visible
        :animations="{
          idle: 'idle.fbx',
          running: 'running.fbx'
        }"
        :animation="pose"
      />
    </ThirdPersonCamera>
    <Keyboard @key-press="handleKeyPress" @key-up="handleKeyUp" />
  </World>
</template>