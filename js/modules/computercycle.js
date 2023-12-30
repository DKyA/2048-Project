import { params } from "../main.js"
import { initLiveGame, initMemoryGame } from "./helpers.js"
import { Environment } from "./environment.js"
import { Model } from "./model.js"

export const computerGame = async () => {

	Environment.initCPDashboard(params.meta.length)

	let models = new Array(params.meta.length).fill(new Model());

	models = simulateGeneration(models)
	reinforcementLearning(models)

}


const reinforcementLearning = models => {

	// creating a copy to play around with...
	const metas = params.meta.sort((a, b) => b.finalScore - a.finalScore)

	metas.forEach(meta => meta.varianceCoefficient = (metas[0].finalScore / meta.finalScore) - 1)

	// Time to update models.
	metas.forEach(meta => {
		const model = models[meta.i]
		model.selfUpdate(meta.varianceCoefficient)
		// traverse & update. EX is oldVal, variance is sigma. NormRand employment
		
	})

}


const simulateGeneration = (models) => {

	for (let i = 0; i < params.meta.length; i++) {
		// creating an alias.
		let meta = params.meta[i]
		meta.i = i;
		meta.maxTile = 0;
		meta.finalScore = 0;

		if (meta.visible) {
			meta = initLiveGame(meta)
		} else {
			meta = initMemoryGame(meta)
		}

		// reintegrate for global usage
		[models[i], meta] = playGame(models[i], meta)
		params.meta[i] = meta
	}

	return models;

}


const playGame = (model, meta) => {

	let isDone = false;

	// If visible, add a 400ms delay in order to be watchable
	if (meta.visible) {
		const gameLoop = setInterval(() => {
			[meta, isDone] = computerMove(meta, model)
			Environment.score = meta.board.score
			Environment.pb = meta.board.score
			if (isDone) {
				clearInterval(gameLoop)
			}
		}, 400);
	}

	// Let the game just play from memory
	else {
		while (!isDone) {
			[meta, isDone] = computerMove(meta, model)
			Environment.pb = meta.board.score
		}

		// Log that we have reached an end
		Environment.stats()

		// Calculate final score
		const scoreNorm = Math.log(meta.maxScore + 1)
		const maxTileNorm = Math.log2(meta.maxTile + 1)
		const weights = [.8, .2]
		const finalScore = (weights[0] * scoreNorm + weights[1] * maxTileNorm) / 2
		meta.finalScore = finalScore

	}

	return [model, meta]

}


const computerMove = (meta, model) => {

	// AI's idea of a move:
	const direction = model.apply(meta.board)

	const pool = ["up", "down", "left", "right"];

	const gameState = meta.game[pool[direction]]()

	if (gameState === 200) {
		return [meta, false];
	}

	if (gameState.status === 100) {
		// Handle environment!!!
		Environment.setScore(meta.game.board.score, meta.board.maxTile, meta.i)
		if (meta.game.board.score > meta.maxScore) {
			meta.maxScore = meta.game.board.score
		}
		if (meta.game.board.maxTile > meta.maxTile) {
			meta.maxTile = meta.game.board.maxTile
		}

		if (!meta.game.board.spawnTile()) {
			gameState.status = 600
			return [meta, true]
		}

	}

	return [meta, false]

}