import { params } from "../main.js"
import { initLiveGame } from "./helpers.js"
import { Environment } from "./environment.js"

export const computerCycle = () => {

	for (let i = 0; i < params.meta.length; i++) {
		// creating an alias.
		let meta = params.meta[i]
		if (meta.visible) {
			meta = initLiveGame(meta)

			let isDone = false;

			const gameLoop = setInterval(() => {

				[meta, isDone] = computerMove(meta)

				if (isDone) {
					clearInterval(gameLoop)
				}

			}, 500);

		}

	}

}

const computerMove = meta => {

	console.log("Hi")

	const direction = Math.floor(Math.random() * 4);
	const pool = ["up", "down", "left", "right"];

	const gameState = meta.game[pool[direction]]()

	if (gameState === 200) {
		return [meta, false];
	}

	if (gameState.status === 100) {

		Environment.score = meta.game.board.score;

		if (meta.game.board.score > meta.maxScore) {
			meta.maxScore = meta.game.board.score
			Environment.pb = meta.maxScore
		}

		if (!meta.game.board.spawnTile()) {
			Environment.endgame(meta.game)
			gameState.status = 600
			return [meta, true]

		}

	}

	return [meta, false]

}