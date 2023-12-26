import { Board } from "./board.js"
import { Game } from "./game.js"
import { params } from "../main.js"

export const spawnProbabilities = () => {

	const prob = Math.random()
	if (prob > 0.8) {
		return 4
	}
	return 2

}


export const initLiveGame = meta => {

	meta.board = new Board(true, params.frame);
	meta.board.init();
	meta.board.place();
	meta.game = new Game(meta.board);
	meta.terminated = false;

	return meta;

}

