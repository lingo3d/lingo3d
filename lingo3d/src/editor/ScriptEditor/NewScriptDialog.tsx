import { Signal, signal, useSignal } from "@preact/signals"
import Dialog from "../component/Dialog"
import CloseableTab from "../component/tabs/CloseableTab"
import { APPBAR_HEIGHT } from "../../globals"
import TextBox from "../component/TextBox"
import SelectBox from "../component/SelectBox"
import IconButton from "../component/IconButton"
import { ScriptLanguage, ScriptType } from "../../interface/IScript"
import { useRef } from "preact/hooks"

export const newScriptDialogSignal: Signal<
    | {
          onConfirm: (
              name: string,
              language: ScriptLanguage,
              type: ScriptType
          ) => void
      }
    | undefined
> = signal(undefined)

const NewScriptDialog = () => {
    const { value } = newScriptDialogSignal
    const nameSignal = useSignal("")
    const langaugeRef = useRef<ScriptLanguage>("TypeScript")
    const typeRef = useRef<ScriptType>("script")

    if (!value) return null

    return (
        <Dialog signal={newScriptDialogSignal}>
            <CloseableTab
                width="100%"
                height={APPBAR_HEIGHT}
                onClose={() => (newScriptDialogSignal.value = undefined)}
            >
                New Script
            </CloseableTab>
            <div style={{ flexGrow: 1 }}>
                <TextBox
                    placeholder="Script Name"
                    style={{ marginTop: 12 }}
                    onChange={(val) => (nameSignal.value = val)}
                />
                <SelectBox
                    label="Language"
                    style={{ paddingLeft: 12, paddingRight: 6 }}
                    options={["TypeScript", "JavaScript"]}
                    onChange={(_, val) =>
                        (langaugeRef.current = val as ScriptLanguage)
                    }
                />
                <SelectBox
                    label="Type"
                    style={{ paddingLeft: 12, paddingRight: 6 }}
                    options={["system", "script"]}
                    onChange={(_, val) => (typeRef.current = val as ScriptType)}
                />
                <div
                    style={{
                        padding: 10,
                        marginTop: 10,
                        display: "flex",
                        gap: 4
                    }}
                >
                    <div style={{ flexGrow: 1 }} />
                    <IconButton
                        label="Cancel"
                        fill="rgba(255, 255, 255, 0.05)"
                        borderless
                        onClick={() =>
                            (newScriptDialogSignal.value = undefined)
                        }
                    />
                    <IconButton
                        label="Confirm"
                        fill
                        disabled={!nameSignal.value}
                        onClick={() => {
                            if (!nameSignal.value) return
                            value.onConfirm(
                                nameSignal.value,
                                langaugeRef.current,
                                typeRef.current
                            )
                            newScriptDialogSignal.value = undefined
                        }}
                    />
                </div>
            </div>
        </Dialog>
    )
}

export default NewScriptDialog
