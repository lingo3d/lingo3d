<script setup lang="ts">
import World from "./components/World.vue"
import Model from "./components/display/Model.vue"
import Cube from "./components/display/primitives/Cube.vue"
import HTML from "./logical/HTML/index.vue"

</script>

<template>
  <World>
    <Cube :animation="{ rotationY: [0, 360] }">
      <Cube :x="200">
        <HTML>
          <div style="color: white">this is super cool</div>
        </HTML>
      </Cube>
    </Cube>
  </World>
</template>