export const getVisibleChildren = object => {
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

export const generateCubeUVSize = parameters => {
	const imageHeight = parameters.envMapCubeUVHeight

	if (imageHeight === null) return null

	const maxMip = Math.log2(imageHeight) - 2

	const texelHeight = 1.0 / imageHeight

	const texelWidth = 1.0 / (3 * Math.max(Math.pow(2, maxMip), 7 * 16))

	return { texelWidth, texelHeight, maxMip }
}

export const setupEnvMap = (reflectionsMaterial, envMap, envMapCubeUVHeight) => {
	reflectionsMaterial.uniforms.envMap.value = envMap

	const envMapCubeUVSize = generateCubeUVSize({ envMapCubeUVHeight })

	reflectionsMaterial.defines.ENVMAP_TYPE_CUBE_UV = ""
	reflectionsMaterial.defines.CUBEUV_TEXEL_WIDTH = envMapCubeUVSize.texelWidth
	reflectionsMaterial.defines.CUBEUV_TEXEL_HEIGHT = envMapCubeUVSize.texelHeight
	reflectionsMaterial.defines.CUBEUV_MAX_MIP = envMapCubeUVSize.maxMip + ".0"

	reflectionsMaterial.needsUpdate = true
}
