import FoundManager from "lingo3d/lib/display/core/FoundManager"
import React, {
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react"
import useDiffProps from "../../hooks/useDiffProps"
import { applyChanges, ParentContext } from "../../hooks/useManager"
import { FoundProps } from "../../props"

const FindAll = React.forwardRef<
  Array<FoundManager>,
  Omit<FoundProps, "name"> & {
    name: string | RegExp
    onLoad?: (managers: Array<FoundManager>) => void
  }
>(({ name, onLoad, ...p }, ref) => {
  const parent = useContext(ParentContext)
  const [managers, setManagers] = useState<Array<any>>()

  const nameOld = useRef(name)
  const _name = useMemo(() => {
    if (
      typeof name !== "string" &&
      typeof nameOld !== "string" &&
      name.toString() === nameOld.toString()
    )
      return nameOld.current

    nameOld.current = name
    return name
  }, [name])

  useLayoutEffect(() => {
    if (!parent || !_name) return

    if ("loaded" in parent) {
      const handle = parent.loaded.then(() => {
        setManagers(parent.findAll(_name))
      })
      return () => {
        handle.cancel()
      }
    }
    setManagers(parent.findAll(_name))
  }, [parent, _name])

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
