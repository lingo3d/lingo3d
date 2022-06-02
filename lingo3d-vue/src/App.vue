<script setup lang="ts">
import { World, Cube, HTML } from "."
import LingoEditor from "./components/editor/LingoEditor.vue";
</script>

<template>
  <World>
    <LingoEditor />
    <Cube>
      <HTML>
        <div>hello world</div>
      </HTML>
    </Cube>
  </World>
  
</template>