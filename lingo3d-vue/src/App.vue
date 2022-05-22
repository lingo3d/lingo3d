<script setup lang="ts">
import { World, Editor, SceneGraph, Toolbar, Library, Cube } from "."
</script>

<template>
  <World>
    <Toolbar />
    <SceneGraph />
    <Editor mouse="enabled" />
    <Library />
    <Cube><Cube /></Cube>
  </World>
  
</template>