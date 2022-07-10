import { useRef } from "react"

export default (props: Record<string, any>, paused?: boolean) => {
  const propsOldRef = useRef<any>({})

  const changes: Array<[string, any]> = []
  const removed: Array<string> = []

  if (paused) return <const>[changes, removed]

  const propsOld = propsOldRef.current
  for (const [key, value] of Object.entries(props)) {
    if (key === "children") continue

    const valueOld = propsOld[key]
    if (valueOld === value) continue

    if (value && typeof value === "object") {
      if (JSON.stringify(value) !== JSON.stringify(valueOld))
        changes.push([key, value])
    } else changes.push([key, value])
  }

  for (const key of Object.keys(propsOld)) !(key in props) && removed.push(key)

  propsOldRef.current = props
  return <const>[changes, removed]
}
