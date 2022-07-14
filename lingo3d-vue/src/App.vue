<script setup lang="ts">
import { ref } from "vue";
import { World, Cube, LingoEditor, TweakPane, PaneInput } from "."

const val = ref("")

const handleChange = (value: any) => {
  val.value = value
}

</script>

<template>
  <World>
    <Cube :move-to="[300, 300, 300, 10]" />
    <LingoEditor />
    <TweakPane>
      <PaneInput name="text" value="text" :values="['text', 'text1']" @change="handleChange" />
    </TweakPane>
  </World>
  
</template>