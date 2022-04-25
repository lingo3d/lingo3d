<script setup lang="ts">
import { ref } from "vue";
import { World, Model } from "."
import Find from "./components/logical/Find.vue";

const hose = ref(false)
const capsule = ref(false)

</script>

<template>
  <World :default-orbit-controls="true">
    <Model src="hello.fbx" :animation="true">
    </Model>
  </World>
  <div style="position: absolute">
    <button @click="hose = !hose">play hose</button>
    <button @click="capsule = !capsule">play capsule</button>
  </div>
</template>