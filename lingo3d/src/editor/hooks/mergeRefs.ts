export default (...inputRefs: Array<any>) =>
    (ref: any) => {
        for (const inputRef of inputRefs)
            if (typeof inputRef === "function") inputRef(ref)
            else inputRef.current = ref
    }
