<script setup lang="ts">
import { World, Cube, LingoEditor, TweakPane, PaneInput } from "."


</script>

<template>
  <World>
    <Cube :move-to="[300, 300, 300, 10]" />
    <LingoEditor />
    <TweakPane>
      <PaneInput name="text" value="text" />
    </TweakPane>
  </World>
  
</template>