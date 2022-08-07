import { Reactive } from "@lincode/reactivity"

export default class AnimReactive<T> extends Reactive<T> {
  public restart!: Function
}
