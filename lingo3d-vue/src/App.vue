<script setup lang="ts">
import { World, LingoEditor, HTMLMesh, Cube, ThirdPersonCamera } from "./index"
</script>

<template>
  <World default-light="studio">
    <Cube :width="9999" :depth="9999" :y="-300" color="red" :roughness="0.3" :metalness="1" physics="map" />
    <ThirdPersonCamera active mouse-control="drag">
      <Cube :height="180" physics="character" />
    </ThirdPersonCamera>
  </World>
</template>
