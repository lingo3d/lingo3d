<script setup lang="ts">
import { Cube } from "lingo3d"
import IPrimitive, { primitiveDefaults } from "lingo3d/lib/interface/IPrimitive"
import { watchEffect } from "vue"
import useManager from "../../../hooks/useManager"
import { extractProps } from "../../../props"

const props = defineProps(extractProps<IPrimitive>(primitiveDefaults))

watchEffect(() => {
  console.log(props)
})

useManager(props, Cube)
</script>

<template>
  <slot />
</template>
