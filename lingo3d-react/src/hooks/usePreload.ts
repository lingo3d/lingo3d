import { preload } from "lingo3d"
import IModel from "lingo3d/lib/interface/IModel"
import { useState } from "react"
import useLayoutEffectOnce from "./useLayoutEffectOnce"

export default (
  urls: Array<string | (Partial<IModel> & { src: string })>,
  total: string | number
) => {
  const [progress, setProgress] = useState(0)

  useLayoutEffectOnce(() => {
    preload(urls, total, (val) => setProgress(val)).then(() => setProgress(100))
  }, [])

  return progress
}
