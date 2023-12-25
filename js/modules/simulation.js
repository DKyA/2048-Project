import { Board } from "./board.js"
import { Game } from "./game.js"
import { Environment } from "./environment.js";
import { params } from "../main.js";


export const beginSimulation = () => {

	if (params.meta.length === 1 && params.meta[0].human) {
		humanGame(params.meta[0]);
	}

}

const humanGame = meta => {

	meta = initPlayerGame(meta)


	// Main Game Loop
	window.addEventListener("keydown", e => {

		let gameState;
		const keycode = e.key.replace("Arrow", "").toLowerCase()
		if (["up", "down", "left", "right"].includes(keycode)) {
			gameState = meta.game[keycode]()
		} else return;

		if (gameState.status === 100) {
			Environment.score = meta.game.board.score;

			if (meta.game.board.score > meta.maxScore) {
				meta.maxScore = meta.game.board.score
				Environment.pb = meta.maxScore
			}

			if (!meta.game.board.spawnTile()) {
				Environment.endgame(meta.game)
				gameState.status = 600
			}

		}

	});


	// Control Buttons:
	Environment.restart.forEach(btn => btn.addEventListener("click", () => {

		meta.board.cleanup()
		Environment.hideTitleScreen()
		Environment.score = 0;
		meta = initPlayerGame(meta)

	}));

}


const initPlayerGame = meta => {

	meta.board = new Board(true, params.frame);
	meta.board.init();
	meta.board.place();
	meta.game = new Game(meta.board);
	meta.terminated = false;

	return meta;

}

