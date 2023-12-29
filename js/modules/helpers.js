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


export const initMemoryGame = meta => {

	meta.board = new Board(false, params.frame);
	meta.board.init();
	meta.game = new Game(meta.board);
	meta.terminated = false;

	return meta;

}


const boxMullerRandom = () => {
	let u = 0, v = 0;
	while (u === 0) u = Math.random(); //Converting [0,1) to (0,1) ]
	while (v === 0) v = Math.random();
	let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

	num = num / 10.0 + 0.5; // Translate to 0 -> 1
	if (num > 1 || num < 0) return boxMullerRandom(); // resample between 0 and 1
	return num;
}


export const normRand = (mean, std) => {

	return mean + boxMullerRandom() * std;

}


// This is staying here.
export const softmax = (z, temperature = 1) => {
	let max = Math.max(...z);
	let scaledScores = z.map(score => Math.exp((score - max) / temperature));
	let sumScaledScores = scaledScores.reduce((sum, val) => sum + val, 0);
	return scaledScores.map(score => score / sumScaledScores);
}


export const probRand = (probabilities) => {
    let cumulativeSum = 0;
    let r = Math.random();
    for (let i = 0; i < probabilities.length; i++) {
        cumulativeSum += probabilities[i];
        if (r < cumulativeSum) {
            return i;
        }
    }
    return probabilities.length - 1;  // In case of rounding errors, return the last index
}
