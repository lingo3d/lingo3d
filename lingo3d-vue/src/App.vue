<script setup lang="ts">
import World from "./components/World.vue"
import Model from "./components/display/Model.vue"
import Cube from "./components/display/primitives/Cube.vue";

</script>

<template>
  <World>
    <Cube :animation="{ rotationY: [0, 360] }">
      <Cube :x="200" />
    </Cube>
    <!-- <Model
     src="bot.fbx"
     :scale="5"
     :animations="{ idle: 'idle.fbx', running: 'running.fbx' }"
     :animation="'running'"
    /> -->
  </World>
</template>