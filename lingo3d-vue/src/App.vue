<script setup lang="ts">
import {
  LingoEditor,
  World,
  Torus,
  SpotLight,
  Model,
  Reflector,
  Setup
} from "."
</script>

<template>
  <World>
    <LingoEditor />
    <Torus
      uuid="G-rPKBBI1ranoz1IJx8gy"
      :x="3.42"
      :y="54.97"
      :z="170.77"
      :scale-x="4"
      :scale-y="4"
      :scale-z="4"
      :cast-shadow="false"
      :receive-shadow="false"
      emissive
      :thickness="0.01"
    />
    <Torus
      uuid="jSncOL3TobowEK4pJ8xv5"
      :x="3.42"
      :y="54.97"
      :z="334.76"
      :scale-x="4"
      :scale-y="4"
      :scale-z="4"
      :cast-shadow="false"
      :receive-shadow="false"
      emissive
      :thickness="0.01"
    />
    <Torus
      uuid="SGzujGGEQmU58M8Abg-Zk"
      :x="3.42"
      :y="54.97"
      :z="7.9"
      :scale-x="4"
      :scale-y="4"
      :scale-z="4"
      :cast-shadow="false"
      :receive-shadow="false"
      emissive
      :thickness="0.01"
    />
    <Torus
      uuid="2mWEvRGTwbxIoJCF-3DIW"
      :x="3.42"
      :y="54.97"
      :z="-175.25"
      :scale-x="4"
      :scale-y="4"
      :scale-z="4"
      :cast-shadow="false"
      :receive-shadow="false"
      emissive
      :thickness="0.01"
    />
    <Torus
      uuid="_BC2ccgrf9rjD_2ZavHQR"
      :x="3.42"
      :y="54.97"
      :z="-311.72"
      :scale-x="4"
      :scale-y="4"
      :scale-z="4"
      :cast-shadow="false"
      :receive-shadow="false"
      emissive
      :thickness="0.01"
    />
    <SpotLight
      uuid="QlrwgE7y3WQ2SycQ4FRN8"
      :x="426.68"
      :y="481.44"
      :z="149.96"
      :angle="0.65"
      :penumbra="0.4"
      :decay="2"
      :distance="12.9"
    />
    <Model
      uuid="62gqnZfLuf1XiA-hwWkM9"
      :y="49.68"
      :width="218.53"
      :depth="409.25"
      src="porsche.glb"
      :metalness-factor="1.5"
      :env-factor="7"
      reflection
    />
    <Reflector
      uuid="FJXmypZJkJBpO2168LIIy"
      :scale-x="100"
      :scale-y="100"
      :blur="256"
      :mirror="0.5"
    />
    <Setup
      :default-light="false"
      :exposure="2"
      bloom
      :bloom-intensity="2"
      :bloom-threshold="0.49"
    />
  </World>
</template>
