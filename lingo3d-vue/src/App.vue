<script setup lang="ts">
import { World, Editor, SceneGraph, Toolbar, Library } from "."
import Cube from "./components/display/primitives/Cube.vue"

const handleMouse = () => {
  console.log("over")
}
</script>

<template>
  <World>
    <Toolbar />
    <SceneGraph />
    <Editor mouse="enabled" />
    <Library />
    <Cube @mouse-over="handleMouse" />
  </World>
  
</template>