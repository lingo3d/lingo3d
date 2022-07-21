<script setup lang="ts">
import { World, Model, LingoEditor, Setup, DirectionalLight } from "./index"
</script>

<template>
  <World>
    <Model
      :x="10588.61"
      :y="9758.37"
      :z="-14228.96"
      :width="128.53"
      :height="100"
      :depth="174.43"
      :scale-x="200"
      :scale-y="200"
      :scale-z="200"
      src="afterrain.glb"
      :roughness-factor="0"
      :metalness-factor="1"
    />
    <DirectionalLight :x="-1000" :y="1000" :z="1000" />
    <DirectionalLight
      :x="-1000"
      :y="1000"
      :z="1000"
      :shadow-distance="5000"
    />
    <LingoEditor />
    <Setup default-light="env.hdr" skybox="env.hdr" :exposure="0.6" ambient-occlusion />
  </World>
</template>