import { normRand } from "./helpers.js"


export class Node {

	constructor(NextLayerBreadth, ReLULeak = 0.01) {

		// All prev nodes will have a link to me, will feed in their values here
		// Setter is defined
		this.preceedingValues = []
		this.connectionWeights = []

		
		this.NextLayerBreadth = NextLayerBreadth;
		this.ReLULeak = ReLULeak

		this.bias = normRand()

		// Nodes for forward- and back-propagation
		this.next = null;
	}

	activateNode(activation = "ReLU") {

		// One-time init. No. of nodes is not dynamic
		if (this.preceedingValues.length !== this.connectionWeights) this.initWeights(activation);

		const weightedSum = this.preceedingValues.reduce((total, x, i) => total += this.connectionWeights[i] * x)

		// Activation function:
		if (activation === "sigmoid") {
			// For endpoints:
			this.val = 1 / (1 + Math.pow(Math.E, -weightedSum))
		}
		else {
			// Hidden layers & default
			this.val = weightedSum > 0 ? weightedSum : weightedSum * this.ReLULeak
		}

		// Preparing preceedingVals for next use
		this.preceedingValues = [];

		// Give my value to the next layer
		if (this.next) {
			this.next.forEach(node => node.propagateValue(this.val))
		}

	}

	initWeights(activation) {

		this.connectionWeights = this.preceedingValues.map(() => {
			if (activation === "ReLU") {
				return normRand(0, Math.sqrt(2 / this.preceedingValues.length))
			}
			return normRand(0, Math.sqrt(2 / (this.NextLayerBreadth + this.preceedingValues.length)))
		})

	}

	set propagateValue(x) {
		this.preceedingValues.push(x)
	}

}
