<script setup lang="ts">
import { World, Cube, HTML, Stats, LingoEditor, Dummy, Find } from "."
import OrbitCamera from "./components/display/cameras/OrbitCamera.vue";


</script>

<template>
  <World>
    <Dummy />
    <OrbitCamera active enable-pan enable-zoom :z="100" :target-y="50" :enabled="false"/>
  </World>
  
</template>