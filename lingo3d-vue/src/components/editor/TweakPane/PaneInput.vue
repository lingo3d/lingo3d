<script setup lang="ts">
import { inject, watchEffect } from "vue"

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number, Boolean],
    required: true
  },
  values: {
    type: Array
  },
  onChange: {
    type: Function
  }
})
const _childrenRef: any = inject("_childrenRef", undefined)

watchEffect((cleanup) => {
  _childrenRef.value = [..._childrenRef.value, props]

  cleanup(() => {
    _childrenRef.value = _childrenRef.value.filter(
      (child: any) => child !== props
    )
  })
})
</script>

<template></template>
