import { preload } from "lingo3d"
import { ref } from "vue"

export default (urls: Array<string>, total: string | number) => {
  const progress = ref(0)

  preload(urls, total, (val) => (progress.value = val)).then(
    () => (progress.value = 100)
  )
  return progress
}
