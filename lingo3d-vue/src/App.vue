<script setup lang="ts">
import { World, Cube, HTML, Stats, LingoEditor } from "."

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
    <Stats />
  </World>
  
</template>