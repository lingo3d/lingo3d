import { preload } from "lingo3d"
import { onUnmounted, ref } from "vue"

export default (urls: Array<string>, total: string | number) => {
  const progress = ref(0)

  let proceed = true
  preload(urls, total, (val) => proceed && (progress.value = val)).then(
    () => proceed && (progress.value = 100)
  )

  onUnmounted(() => {
    proceed = false
  })
  return progress
}
