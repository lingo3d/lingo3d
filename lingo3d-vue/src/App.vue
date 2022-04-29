<script setup lang="ts">
import { ref } from "vue";
import { World, Editor, Cube, types, Keyboard, OrbitCamera } from "."

const cubeRef = ref<types.Cube>()

const handleKeyPress = () => {
  cubeRef.value!.x += 1
}

</script>

<template>
  <World>
    <Cube ref="cubeRef" />
    <Editor :block-keyboard="true" />
    <Keyboard @key-press="handleKeyPress" />
    <OrbitCamera />
  </World>
</template>