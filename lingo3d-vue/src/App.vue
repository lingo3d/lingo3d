<script setup lang="ts">
import { World, Cube, types } from "."
import Model from "./components/display/Model.vue"
import ThirdPersonCamera from "./components/display/cameras/ThirdPersonCamera.vue"
import Keyboard from "./components/api/Keyboard.vue"
import { ref } from "vue";
import Skybox from "./components/display/Skybox.vue";

const model = ref<types.Model>()

const handleKeyPress = (key: string) => {
  if (key === "w")
    model.value?.moveForward(-10)
}

</script>

<template>
  <World default-light="env.hdr">
    <Model src="gallery.glb" :scale="20" physics="map" />
    <ThirdPersonCamera active mouse-control>
      <Model src="bot.fbx" physics="character" ref="model" pbr />
    </ThirdPersonCamera>
    <Keyboard @key-press="handleKeyPress" />
    <Skybox texture="env.hdr" />
  </World>
</template>