import FoundManager from "lingo3d/lib/display/core/FoundManager"
import React, { useContext, useLayoutEffect, useState } from "react"
import useDiffProps from "../../hooks/useDiffProps"
import { applyChanges, ParentContext } from "../../hooks/useManager"
import { FoundManagerProps } from "../../props/FoundManagerProps"

const FindAll = React.forwardRef<
  Array<FoundManager>,
  Omit<FoundManagerProps, "name"> & {
    name: string | RegExp | ((name: string) => boolean)
    onLoad?: (managers: Array<FoundManager>) => void
  }
>(({ name, onLoad, ...p }, ref) => {
  const parent = useContext(ParentContext)
  const [managers, setManagers] = useState<Array<any>>()

  useLayoutEffect(() => {
    if (!parent || !name) return

    if ("loaded" in parent) {
      const handle = parent.loaded.then(() => {
        setManagers(parent.findAll(name))
      })
      return () => {
        handle.cancel()
      }
    }
    setManagers(parent.findAll(name))
  }, [parent])

  const [changed, removed] = useDiffProps(p, !managers)
  if (managers)
    for (const manager of managers) applyChanges(manager, changed, removed)

  useLayoutEffect(() => {
    if (!ref || !managers) return

    if (typeof ref === "function") ref(managers)
    else ref.current = managers
  }, [ref, managers])

  useLayoutEffect(() => {
    managers && onLoad?.(managers)
  }, [managers])

  return null
})

export default FindAll
