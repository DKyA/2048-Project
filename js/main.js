import { beginSimulation } from "./modules/simulation.js"

export const params = {

	meta: [
		{
			human: true,
			maxScore: 0,
		},
	],

	frame: document.querySelector("[js-holder]")

}

beginSimulation()
