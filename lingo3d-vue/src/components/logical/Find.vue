<script setup lang="ts">
import FoundManager from "lingo3d/lib/display/core/FoundManager"
import Loaded from "lingo3d/lib/display/core/Loaded"
import ObjectManager from "lingo3d/lib/display/core/ObjectManager"
import { foundManagerDefaults } from "lingo3d/lib/interface/IFoundManager"
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
import foundManagerProps from "../../props/foundManagerProps"
import processDefaults from "../../props/utils/processDefaults"

const props = defineProps({
  ...foundManagerProps,
  onLoad: Function as PropType<(found: FoundManager) => void>
})

const parentRef = inject<Ref<ObjectManager | Loaded> | undefined>(
  "parent",
  undefined
)
const managerRef = ref<FoundManager>()
provide("parent", managerRef)

watchEffect((onCleanUp) => {
  const { name } = props
  const parent = toRaw(parentRef?.value)
  if (!parent || !name) return

  if ("loaded" in parent) {
    const handle = parent.loaded.then(() => {
      managerRef.value = parent.find(name)
    })
    return onCleanUp(() => {
      handle.cancel()
    })
  }
  managerRef.value = parent.find(name)
})

const paused = computed(() => !managerRef.value)
const defaults = processDefaults(foundManagerDefaults)
const diff = useDiffProps(props, defaults, paused)
applyChanges(managerRef, undefined, diff, defaults)

watchEffect(() => {
  const manager = toRaw(managerRef.value)
  manager && props.onLoad?.(manager)
})
</script>

<template>
  <slot />
</template>
