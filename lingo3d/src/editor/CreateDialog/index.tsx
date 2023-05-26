import { Signal, signal } from "@preact/signals"
import Dialog from "../component/Dialog"
import CloseableTab from "../component/tabs/CloseableTab"
import { APPBAR_HEIGHT } from "../../globals"
import TextInputBox from "../component/TextInputBox"

export const createDialogSignal: Signal<
    | {
          title?: string
          data?: Record<string, any>
          onConfirm: (payload: {
              name: string
              data?: Record<string, any>
          }) => void
      }
    | undefined
> = signal(undefined)

const CreateDialog = () => {
    if (!createDialogSignal.value) return null

    return (
        <Dialog signal={createDialogSignal}>
            <CloseableTab
                width="100%"
                height={APPBAR_HEIGHT}
                onClose={() => (createDialogSignal.value = undefined)}
            >
                {createDialogSignal.value.title}
            </CloseableTab>
            <div className="lingo3d-flexcol" style={{ flexGrow: 1 }}>
                <TextInputBox placeholder="Name" style={{ marginTop: 12 }} />
            </div>
        </Dialog>
    )
}

export default CreateDialog
