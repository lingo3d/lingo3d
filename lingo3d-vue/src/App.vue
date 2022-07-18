<script setup lang="ts">
import { World, Cube, ThirdPersonCamera } from "./index"
</script>

<template>
  <World>
    <ThirdPersonCamera active>
    </ThirdPersonCamera>
      <Cube :animation="{ rotationY: [0, 180, 360] }" />
  </World>
</template>