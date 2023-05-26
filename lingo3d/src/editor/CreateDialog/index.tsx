import { Signal, signal } from "@preact/signals"
import Dialog from "../component/Dialog"
import AppBar from "../component/bars/AppBar"
import Tab from "../component/tabs/Tab"

export const createDialogSignal: Signal<
    | {
          type: string
          data?: Record<string, any>
          onConfirm: (payload: {
              type: string
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
            <AppBar>
                <Tab>{"New" + createDialogSignal.value.type}</Tab>
            </AppBar>
        </Dialog>
    )
}

export default CreateDialog
