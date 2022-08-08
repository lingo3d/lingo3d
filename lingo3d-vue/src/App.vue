<script setup lang="ts">
import {
  World,
  Model,
  LingoEditor,
  Setup,
  DirectionalLight,
  UI,
  Frame,
  Cube
} from "./index"
</script>

<template>
  <World default-light="studio">
    <Cube :metalness-factor="1" :roughness-factor="0" />
    <LingoEditor />
  </World>
</template>
