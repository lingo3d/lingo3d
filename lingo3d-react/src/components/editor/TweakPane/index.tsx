import React, { useRef, useEffect } from "react"
import { Pane } from "tweakpane"
import addInputs from "./addInputs"
import useInit from "./useInit"

type CustomEditorProps = {
  children?: JSX.Element | Array<JSX.Element>
}

const CustomEditor = ({ children }: CustomEditorProps) => {
  const elRef = useInit()
  const paneRef = useRef<Pane>()

  const _children: Array<JSX.Element | undefined> = Array.isArray(children)
    ? children
    : [children]

  useEffect(() => {
    const el = elRef.current
    if (!el || !_children.length) return

    const pane = (paneRef.current = new Pane({ container: el }))

    const params = Object.fromEntries(
      _children
        .filter((child) => child?.props?.name)
        .map((child) => [
          child!.props.name,
          child!.props.values ? child!.props : child!.props.value
        ])
    )
    const onChange = Object.fromEntries(
      _children
        .filter((child) => child?.props?.name)
        .map((child) => [child!.props.name, child!.props.onChange])
    )
    addInputs(pane, "inputs", params, (name, value) => onChange[name]?.(value))

    return () => {
      pane.dispose()
    }
  }, [_children])

  return (
    <div
      ref={elRef}
      className="lingo3d-ui"
      style={{
        width: 300,
        background: "rgb(40, 41, 46)",
        position: "absolute",
        top: 0,
        right: 0
      }}
    />
  )
}

export default CustomEditor
