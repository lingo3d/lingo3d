<script setup lang="ts">
import { Pane } from "tweakpane"
import { provide, ref, toRaw, watchEffect } from "vue"
import addInputs from "./addInputs"
import useInit from "./useInit"

const elRef = useInit()

const _childrenRef = ref<Array<any>>([])
provide("_childrenRef", _childrenRef)

watchEffect((cleanup) => {
  const el = toRaw(elRef.value)
  const _children = toRaw(_childrenRef.value)
  if (!el || !_children.length) return

  const pane = new Pane({ container: el })

  const params = Object.fromEntries(
    _children
      .filter((child) => child.name)
      .map((child) => [
        child.name,
        child.values ? child : child.value
      ])
  )
  const onChange = Object.fromEntries(
    _children
      .filter((child) => child.name)
      .map((child) => [child.name, child.onChange])
  )
  addInputs(pane, "inputs", params, (name, value) => onChange[name]?.(value))

  cleanup(() => {
    pane.dispose()
  })
})
</script>

<template>
  <div
    ref="elRef"
    className="lingo3d-ui"
    style="width: 300px; background: rgb(40, 41, 46); position: absolute; top: 0px; right: 0px; z-index: 1;"
  >
    <slot />
  </div>
</template>
