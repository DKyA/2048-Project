import { Environment } from "./environment.js";
import { initLiveGame } from "./helpers.js";

export const controls = ["up", "left", "down", "right"]

export const humanGame = meta => {

	Environment.initHumanDashboard();

	meta = initLiveGame(meta)
	const events = ['click','keydown']

	// Main Game Loop
	events.forEach(evt => window.addEventListener(evt, e => {

		let gameState;
		if (evt === "keydown") {
			const keycode = e.key.replace("Arrow", "").toLowerCase()
			if (controls.includes(keycode)) {
				gameState = meta.game[keycode]()
			} else return;
		}
		if (evt === 'click' && e.target.hasAttribute("js-mobile-controls")) {
			gameState = meta.game[e.target.getAttribute("js-mobile-controls")]()
		}

		if (gameState) {

			Environment.endgame(meta.game)
			gameState.status = 600
			return // TEMPORARY 3 LINES

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

		return

		}

		if (e.target.hasAttribute('js-restart')) {

			meta.board.cleanup()
			Environment.hideTitleScreen()
			Environment.score = 0;
			meta = initLiveGame(meta)

		}

	}));

}
