export const spawnProbabilities = () => {

	const prob = Math.random()
	if (prob > 0.8) {
		return 4
	}
	return 2

}