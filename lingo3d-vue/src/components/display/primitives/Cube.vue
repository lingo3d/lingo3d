<script setup lang="ts">
import { Cube } from "lingo3d"
import IPrimitive, { primitiveDefaults } from "lingo3d/lib/interface/IPrimitive"
import useManager from "../../../hooks/useManager"

const options = {
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
  z: {
    type: Number,
    default: 0,
  },
  rotationX: {
    type: Number,
    default: 0,
  },
  rotationY: {
    type: Number,
    default: 0,
  },
  rotationZ: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: "#ffffff",
  },
}

// const props = defineProps<Partial<IPrimitive>>()

// useManager(props, Cube)
</script>

<template>
  <slot />
</template>
