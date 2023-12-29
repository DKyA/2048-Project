import { params } from "../main.js"
import { initLiveGame, initMemoryGame } from "./helpers.js"
import { Environment } from "./environment.js"
import { Model } from "./model.js"

export const computerGame = () => {

	Environment.initCPDashboard()

	for (let i = 0; i < params.meta.length; i++) {
		// creating an alias.
		let meta = params.meta[i]

		if (meta.visible) {
			meta = initLiveGame(meta)
		} else {
			meta = initMemoryGame(meta)
		}

		let isDone = false;

		const model = new Model();

		// If visible, add a 400ms delay in order to be watchable
		if (meta.visible) {
			const gameLoop = setInterval(() => {
				[meta, isDone] = computerMove(meta, model)
				if (isDone) {
					clearInterval(gameLoop)
				}
				Environment.score = meta.board.score
				Environment.pb = meta.board.score
			}, 400);
		}

		// Let the game just play from memory
		else {
			while (!isDone) {
				[meta, isDone] = computerMove(meta, model)
				Environment.pb = meta.board.score
			}
		}

	}

}

const computerMove = (meta, model) => {

	const direction = model.apply(meta.board)

	const pool = ["up", "down", "left", "right"];

	const gameState = meta.game[pool[direction]]()

	if (gameState === 200) {
		return [meta, false];
	}

	if (gameState.status === 100) {
// Handle environment!!!
		if (meta.game.board.score > meta.maxScore) {
			meta.maxScore = meta.game.board.score
		}

		if (!meta.game.board.spawnTile()) {
			gameState.status = 600
			return [meta, true]
		}

	}

	return [meta, false]

}