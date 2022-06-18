<script setup lang="ts">
import htmlContainer from "./HTML/htmlContainer"
</script>

<template>
    <Teleport :to="htmlContainer">
        <div style="pointer-events: all; position: static;">
            <slot />
        </div>
    </Teleport>
</template>