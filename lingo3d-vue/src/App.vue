<script setup lang="ts">
import { World, Cube, OrbitCamera, LingoEditor } from "./index"
import { ref } from "vue"

const state = ref(1)

const cameraChange = () => {
  console.log("here")
  state.value = state.value === 1 ? 2 : 1
}
</script>

<template>
  <World default-light="studio">
    <Cube @click="cameraChange" :y="50" />
    <OrbitCamera :transition="0.02" :active="state === 1" :y="100" />
    <OrbitCamera :transition="0.02" :active="state === 2" :y="300" />
    <!-- <LingoEditor /> -->
  </World>
</template>
