<script setup lang="ts">
import { ref } from "vue";
import { World, Model, Editor } from "."

const hose = ref(false)
const capsule = ref(false)

</script>

<template>
  <World :default-orbit-controls="true">
    <Model src="hello.fbx" :animation="true">
    </Model>
    <Editor />
  </World>
  <div style="position: absolute">
    <button @click="hose = !hose">play hose</button>
    <button @click="capsule = !capsule">play capsule</button>
  </div>
</template>