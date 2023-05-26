import { Signal, signal, useSignal } from "@preact/signals"
import Dialog from "../component/Dialog"
import CloseableTab from "../component/tabs/CloseableTab"
import { APPBAR_HEIGHT } from "../../globals"
import TextBox from "../component/TextBox"
import SelectBox from "../component/SelectBox"
import IconButton from "../component/IconButton"

export const newScriptDialogSignal: Signal<
    | {
          title?: string
          data: Record<string, any>
          onConfirm: (data: Record<string, any>) => void
      }
    | undefined
> = signal(undefined)

const NewScriptDialog = () => {
    const { value } = newScriptDialogSignal
    const nameSignal = useSignal("")
    if (!value) return null

    return (
        <Dialog signal={newScriptDialogSignal}>
            <CloseableTab
                width="100%"
                height={APPBAR_HEIGHT}
                onClose={() => (newScriptDialogSignal.value = undefined)}
            >
                {value.title}
            </CloseableTab>
            <div style={{ flexGrow: 1 }}>
                <TextBox
                    placeholder="Script Name"
                    style={{ marginTop: 12 }}
                    onChange={(val) => {
                        value.data.name = val
                        nameSignal.value = val
                    }}
                />
                <SelectBox
                    label="Language"
                    style={{ paddingLeft: 12, paddingRight: 6 }}
                    options={["TypeScript", "JavaScript"]}
                    onChange={(_, val) => (value.data.type = val)}
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
                            if (!value.data.name) return
                            value.onConfirm(value.data)
                            newScriptDialogSignal.value = undefined
                        }}
                    />
                </div>
            </div>
        </Dialog>
    )
}

export default NewScriptDialog
