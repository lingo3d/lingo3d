<script setup lang="ts">
import { watchEffect } from "vue";
import { elements } from "./render"

watchEffect(() => {
    console.log([...elements.value])
})

</script>

<template>
    <div style="color: white">hello world</div>
</template>
