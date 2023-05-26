import { Signal, signal } from "@preact/signals"
import Dialog from "../component/Dialog"
import CloseableTab from "../component/tabs/CloseableTab"
import { APPBAR_HEIGHT } from "../../globals"
import TextBox from "../component/TextBox"
import SelectBox from "../component/SelectBox"
import IconButton from "../component/IconButton"

export const createDialogSignal: Signal<
    | {
          title?: string
          data: Record<string, any>
          onConfirm: (data: Record<string, any>) => void
      }
    | undefined
> = signal(undefined)

const CreateDialog = () => {
    const { value } = createDialogSignal
    if (!value) return null

    return (
        <Dialog signal={createDialogSignal}>
            <CloseableTab
                width="100%"
                height={APPBAR_HEIGHT}
                onClose={() => (createDialogSignal.value = undefined)}
            >
                {value.title}
            </CloseableTab>
            <div style={{ flexGrow: 1 }}>
                <TextBox
                    placeholder="Script Name"
                    style={{ marginTop: 12 }}
                    onChange={(val) => (value.data.name = val)}
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
                        onClick={() => (createDialogSignal.value = undefined)}
                    />
                    <IconButton
                        label="Confirm"
                        fill
                        onClick={() => value.onConfirm(value.data)}
                    />
                </div>
            </div>
        </Dialog>
    )
}

export default CreateDialog
