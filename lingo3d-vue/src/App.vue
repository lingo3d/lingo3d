<script setup lang="ts">
import { World, Cube, LingoEditor } from "."


</script>

<template>
  <World>
    <Cube :move-to="[300, 300, 300, 10]" />
    <LingoEditor />
  </World>
  
</template>