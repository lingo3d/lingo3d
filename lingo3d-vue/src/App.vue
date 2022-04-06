<script setup lang="ts">
import World from "./components/World.vue"
import Cube from "./components/display/primitives/Cube.vue"
import { mouse } from "lingo3d"
import { reactive } from "vue"

const position = reactive<{ x: number | undefined }>({
  x: undefined
})

mouse.onClick = () => {
  position.x = position.x === undefined ? 100 : undefined
}

</script>

<template>
  <World>
    <Cube :x="position.x" />
  </World>
</template>