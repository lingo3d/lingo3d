<script setup lang="ts">
import { World, Cube, LingoEditor, TweakPane, PaneInput, Model, Plane } from "."




</script>

<template>
  <World>
      <!-- <OrbitCamera
        :y="250"
        :rotation-x="-14.13"
        :rotation-y="2.98"
        :rotation-z="0.75"
        :inner-rotation-x="-14.2"
        :inner-y="250"
        :inner-z="930"
        :fov="50"
        :min-polar-angle="77"
        :max-polar-angle="140"
        :min-azimuth-angle="-Infinity"
        :max-azimuth-angle="Infinity"
        :polar-angle="49.04"
        :azimuth-angle="-95.82"
        enable-damping
        enable-zoom
        active
      > -->
        <Model
          name="zhuchangjing"
          :metalness-factor="0.8"
          :roughness-factor="0.5"
          :opacity-factor="1"
          :emissive-intensity-factor="1"
          adjust-emissive-color="#000000"
          :y="250"
          :width="20"
          :height="100"
          :depth="20"
          :scale-x="5"
          :scale-y="5"
          :scale-z="5"
          :rotation-y="-90"
          src="/mod/youhua/zuanji-v1.glb"
        />
      <!-- </OrbitCamera> -->
      <!-- <Plane
        bloom
        :roughness-factor="1"
        :opacity-factor="1"
        :emissive-intensity-factor="1"
        adjust-color="#ffffff"
        :scale-x="30"
        :scale-y="30"
        :rotation-x="-90"
        texture="/mod/bg.jpg"
        :metalness="1"
        :normal-scale="{ x: 1, y: 1 }"
      /> -->
      <!-- <Reflector
        :opacity-factor="0.2"
        :y="0.2"
        :width="3000"
        :height="3000"
        :normal-scale="{ x: 1, y: 1 }"
        :blur="2560"
      /> -->
      <!-- <AreaLight
        :y="695.48"
        :scale-x="10"
        :scale-y="10"
        :rotation-x="-90"
        :intensity="2"
      /> -->
      <Model
        name="nijiangbeng"
        :x="61.07"
        :y="14.92"
        :z="-460.39"
        :width="104.74"
        :depth="278.41"
        :scale-x="0.3"
        :scale-y="0.3"
        :scale-z="0.3"
        :rotation-y="90"
        src="/mod/youhua/njb-v1.glb"
      />
      <Model
        name="aaa"
        :x="145.07"
        :y="11.06"
        :z="-267.61"
        :width="968.05"
        :height="100"
        :depth="175.37"
        :scale-x="0.5"
        :scale-y="0.5"
        :scale-z="0.5"
        :rotation-x="180"
        :rotation-y="90"
        :rotation-z="180"
        src="/mod/youhua/AAA-v1.glb"
      />
      <Model
        name="ccc"
        :x="-361.66"
        :y="25.13"
        :z="-11.08"
        :width="148.34"
        :depth="238.63"
        :scale-x="0.5"
        :scale-y="0.5"
        :scale-z="0.5"
        :rotation-y="90"
        src="/mod/youhua/CCC-v1.glb"
      />
      <!-- <Setup
        default-light="studio"
        :default-light-scale="0.7"
        skybox="/mod/moonless_golf_2k.hdr"
        :bloom-strength="1"
        :bloom-radius="0.5"
        :bloom-threshold="0.2"
        ambient-occlusion
        motion-blur
        :motion-blur-strength="0.2"
      /> -->
      <!-- <LingoEditor /> -->
    </World>
  
</template>