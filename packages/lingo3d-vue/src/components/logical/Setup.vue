<script setup lang="ts">
import { applySetup } from "lingo3d"
import { watchEffect } from "vue"
import setupProps from "../../props/setupProps"

const props = defineProps(setupProps)

watchEffect(onCleanUp => {
    applySetup(props as any)

    onCleanUp(() => {
        applySetup({})
    })
})
</script>

<template>
</template>