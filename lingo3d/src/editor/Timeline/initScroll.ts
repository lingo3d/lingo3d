import {
    getTimelineScroll,
    setTimelineScroll
} from "../../states/useTimelineScroll"

export default (el: Element | null | undefined) => {
    if (!el) return
    getTimelineScroll((scroll) => (el.scrollLeft = scroll))
    el.addEventListener("scroll", () => setTimelineScroll(el.scrollLeft))
}
