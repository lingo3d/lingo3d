<script setup lang="ts">
import { World, types, useSpring, Find, HTML, ThirdPersonCamera, Keyboard, Model } from "."
import { computed, ref } from "vue"

const model = ref<types.Model>()
const pose = ref("idle")
const mouseOver = ref(false)

const camX = computed(() => mouseOver.value ? 25 : 0)
const camY = computed(() => mouseOver.value ? 50 : 50)
const camZ = computed(() => mouseOver.value ? 50 : 200)

const xSpring = useSpring({ to: camX, bounce: 0 })
const ySpring = useSpring({ to: camY, bounce: 0 })
const zSpring = useSpring({ to: camZ, bounce: 0 })

const handleKeyPress = (key: string) => {
  if (key === "w") {
    model.value?.moveForward(-10)
    pose.value = "running"
  }
}
const handleKeyUp = () => {
  pose.value = "idle"
}

</script>

<template>
  <World default-light="env.hdr" skybox="env.hdr">
    <Model src="gallery.glb" :scale="20" physics="map">
      <Find
       name="a6_CRN.a6_0"
       @mouse-over="mouseOver = true"
       @mouse-out="mouseOver = false"
       :outline="mouseOver"
      >
        <HTML v-if="mouseOver">
          <div style="color: white">Hello World</div>
        </HTML>
      </Find>
    </Model>
    <ThirdPersonCamera active mouse-control :inner-x="xSpring" :inner-y="ySpring" :inner-z="zSpring">
      <Model
        src="bot.fbx"
        physics="character"
        ref="model"
        pbr
        box-visible
        :animations="{
          idle: 'idle.fbx',
          running: 'running.fbx'
        }"
        :animation="pose"
      />
    </ThirdPersonCamera>
    <Keyboard @key-press="handleKeyPress" @key-up="handleKeyUp" />
  </World>
</template>