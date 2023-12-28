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


const boxMullerRandom = () => {
	let u = 0, v = 0;
	while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
	while (v === 0) v = Math.random();
	let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

	num = num / 10.0 + 0.5; // Translate to 0 -> 1
	if (num > 1 || num < 0) return boxMullerRandom(); // resample between 0 and 1
	return num;
}


export const normRand = (mean, std) => {

	return mean + boxMullerRandom() * std;

}
