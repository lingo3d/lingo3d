<script setup lang="ts">
import { World, Cube, HTML } from "."
import LingoEditor from "./components/editor/LingoEditor.vue"

const handleClick = () => {
  console.log("here")
}

</script>

<template>
  <World>
    <Cube>
      <HTML>
        <div style="color: red; pointer-events: auto;" @click="handleClick">hello world</div>
      </HTML>
    </Cube>
  </World>
  
</template>