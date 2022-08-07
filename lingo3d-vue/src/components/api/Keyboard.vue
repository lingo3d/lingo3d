<script setup lang="ts">
import { Keyboard } from "lingo3d"
import useManager from "../../hooks/useManager"
import keyboardProps from "../../props/keyboardProps"

const props = defineProps(keyboardProps)
const manager = useManager(props, Keyboard)
defineExpose(manager)
</script>

<template></template>
