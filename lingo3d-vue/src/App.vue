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
  <World>
    <Cube :metalness-factor="1" :roughness-factor="0" />
    <Setup default-light="studio" />
    <LingoEditor />
  </World>
</template>
