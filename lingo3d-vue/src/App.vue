<script setup lang="ts">
import { World, Editor, SceneGraph, Toolbar, Scene, Library } from "."

</script>

<template>
  <World default-orbit-controls>
    <Toolbar />
    <SceneGraph />
    <Editor />
    <Library />
  </World>
  
</template>