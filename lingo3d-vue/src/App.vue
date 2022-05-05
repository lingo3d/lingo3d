<script setup lang="ts">
import { ref } from "vue"
import { World, Editor, Cube, types, Keyboard, OrbitCamera, SceneGraph, HTML } from "."

const cubeRef = ref<types.Cube>()

const handleKeyPress = () => {
  cubeRef.value!.x += 1
}

</script>

<template>
  <World>
    <Cube ref="cubeRef">
      <HTML>
        hello world
      </HTML>
    </Cube>
    <SceneGraph />
    <Editor :block-keyboard="true" />
    <Keyboard @key-press="handleKeyPress" />
    <OrbitCamera />
  </World>
  <SceneGraph />
</template>