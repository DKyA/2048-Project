
import { params } from "../main.js";
import { computerGame } from "./computercycle.js";
import { humanGame } from "./humancycle.js";


export const beginSimulation = () => {

	if (params.meta.length === 1 && params.meta[0].human) {
		return humanGame(params.meta[0]);
	}

	computerGame()

}
