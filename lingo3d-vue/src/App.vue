<script setup lang="ts">
import { World, Cube, ThirdPersonCamera } from "./index"
import LingoEditor from "./components/editor/LingoEditor.vue";
</script>

<template>
  <World>
    <ThirdPersonCamera active :inner-rotation-z="-500">
      <Cube :animation="{ rotationY: [0, 180, 360] }" />
    </ThirdPersonCamera>
    <LingoEditor />
  </World>
</template>