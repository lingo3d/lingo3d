export const getVisibleChildren = (object) => {
    const queue = [object]
    const objects = []

    while (queue.length !== 0) {
        const mesh = queue.shift()
        if (mesh.material) objects.push(mesh)

        for (const c of mesh.children) {
            if (c.visible) queue.push(c)
        }
    }

    return objects
}
