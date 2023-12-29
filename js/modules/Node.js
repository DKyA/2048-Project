import { normRand } from "./helpers.js"


export class Node {

	constructor(nextLayer = null, activation = "ReLU", thisLayerBreadth, ReLULeak = 0.01) {

		// All prev nodes will have a link to me, will feed in their values here
		// Setter is defined
		this.preceedingValues = [];
		this.connectionWeights = [];

		this.activation = activation;

		this.thisLayerBreadth = thisLayerBreadth;
		this.nextLayer = nextLayer;
		this.ReLULeak = ReLULeak;

		this.bias = normRand(0.1, 0.01);

	}

	activateNode() {

		const weightedSum = this.preceedingValues.reduce((total, x, i) => total + this.connectionWeights[i] * x, 0) || 0

		if (this.activation === "softmax") {
			this.val = weightedSum
			return;
			// No activation. Softmax will be executed on the layer level.
			// Also, softmax means that this node is in the final layer
			// No activation needed.
		}

		// Activation function:
		if (this.activation === "sigmoid") {
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
		if (this.nextLayer) {
			this.nextLayer.forEach(node => node.propagateValue = this.val)
		}

	}

	set initWeights(prevLayerBreadth) {

		this.prevLayerBreadth = prevLayerBreadth;

		for (let i = 0; i < this.prevLayerBreadth; i ++) {
			if (this.activation === "ReLU") {
				this.connectionWeights.push(normRand(0, Math.sqrt(2 / prevLayerBreadth)))
				continue;
			}
			// sigmoid and softmax

			const std = Math.sqrt(2 / (this.nextLayer ? this.nextLayer.length : this.thisLayerBreadth + prevLayerBreadth || this.thisLayerBreadth))
			this.connectionWeights.push(normRand(0, std))
		}

	}

	set propagateValue(x) {
		this.preceedingValues.push(x)
	}

	set input(x) {
		this.preceedingValues = [x]
		this.activateNode()
	}

}
