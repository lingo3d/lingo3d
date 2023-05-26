import { Signal, signal } from "@preact/signals"
import Dialog from "../component/Dialog"
import AppBar from "../component/bars/AppBar"
import CloseableTab from "../component/tabs/CloseableTab"
import { APPBAR_HEIGHT } from "../../globals"

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
            <CloseableTab width="100%" height={APPBAR_HEIGHT}>
                {"New " + createDialogSignal.value.type}
            </CloseableTab>
        </Dialog>
    )
}

export default CreateDialog
