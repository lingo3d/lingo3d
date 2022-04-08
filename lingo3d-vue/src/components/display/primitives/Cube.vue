<script setup lang="ts">
import { type } from "@lincode/utils";
import { Cube } from "lingo3d"
import IPrimitive, { primitiveDefaults } from "lingo3d/lib/interface/IPrimitive"
import { watchEffect } from "vue";
import useManager from "../../../hooks/useManager"


type Extract<Type> = {
  [Property in keyof Type]: Type[Property] extends string ? StringConstructor : NumberConstructor
};


const props = defineProps({} as Extract<IPrimitive>)

watchEffect(() => {
  console.log(props)
})

useManager(props, Cube)
</script>

<template>
  <slot />
</template>
