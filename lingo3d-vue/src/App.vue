<script setup lang="ts">
import World from "./components/World.vue"
import Cube from "./components/display/primitives/Cube.vue"
import HTML from "./components/logical/HTML/index.vue"
import { ref } from "vue"
import { nanoid } from "nanoid"

const cubes = ref([nanoid()])

const addCube = () => {
  cubes.value = [...cubes.value, nanoid()]
}
const removeCube = () => {
  cubes.value.pop()
  cubes.value = [...cubes.value]
}

</script>

<template>
  <World>
    <Cube :physics="true" :y="500" v-for="cube in cubes" :key="cube">
      <HTML>
        <div style="color: red">{{cube}}</div>
      </HTML>
    </Cube>
    <Cube :width="9999" :depth="9999" :y="-300" :physics="true" :mass="0" color="blue" />
  </World>
  <div style="position: absolute">
    <button @click="addCube">add</button>
    <button @click="removeCube">remove</button>
  </div>
</template>