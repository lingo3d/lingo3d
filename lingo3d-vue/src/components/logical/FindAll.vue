<script setup lang="ts">
import FoundManager from "lingo3d/lib/display/core/FoundManager"
import Loaded from "lingo3d/lib/display/core/Loaded"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { foundDefaults } from "lingo3d/lib/interface/IFound"
import {
  inject,
  ref,
  watchEffect,
  computed,
  Ref,
  provide,
  toRaw,
  PropType
} from "vue"
import useDiffProps from "../../hooks/useDiffProps"
import { applyChanges } from "../../hooks/useManager"
import foundProps from "../../props/foundProps"
import processDefaults from "../../props/utils/processDefaults"

const props = defineProps({
  ...foundProps,
  name: {
    required: true,
    type: [String, RegExp]
  },
  onLoad: Function as PropType<(found: Array<FoundManager>) => void>
})

const parentRef = inject<Ref<ObjectManager | Loaded> | undefined>(
  "parent",
  undefined
)
const managerRef = ref<Array<FoundManager>>()
provide("parent", managerRef)

watchEffect((onCleanUp) => {
  const { name } = props
  const parent = toRaw(parentRef?.value)
  if (!parent || !name) return

  if ("loaded" in parent) {
    const handle = parent.loaded.then(() => {
      managerRef.value = parent.findAll(name)
    })
    return onCleanUp(() => {
      handle.cancel()
    })
  }
  managerRef.value = parent.findAll(name)
})

const paused = computed(() => !managerRef.value)
const defaults = processDefaults(foundDefaults)
const diff = useDiffProps(props, defaults, paused)
applyChanges(managerRef, undefined, diff, defaults)

watchEffect(() => {
  const manager = toRaw(managerRef.value)
  manager && props.onLoad?.(manager)
})
</script>

<template>
</template>
