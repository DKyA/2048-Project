import { Node } from "./Node.js";
import { probRand, softmax } from "./helpers.js";


export class Model {

	constructor (hiddenLayers = [32]) {

		this.modelStructure = [17, ...hiddenLayers, 4]

		// For purposes of network creation, I want to reverse, I want to append end to previous:
		const creationOrder = [...this.modelStructure]
		creationOrder.reverse()

		// Create the network:
		this.layers = []

		for (let i = 0; i < creationOrder.length; i++) {

			this.layers.push(new Layer())

			// Determine activationType:
			let activationType;
			if (i === 0) {
				activationType = "softmax"
			} else if (i === creationOrder.length - 1) {
				activationType = "sigmoid"
			} else {
				activationType = "ReLU"
			}

			for (let j = 0; j < creationOrder[i]; j++) {

				let hasNextLayer = i > 0 ? this.layers[i - 1].nodes : null
				this.layers[i].addNodes = new Node(hasNextLayer, activationType, creationOrder[i])

			}

			// I now can access the previous layer and update
			if (i > 0) {
				this.layers[i - 1].addConnections = creationOrder[i]
			}

		}

		this.layers.reverse()

	}

	apply (board) {

		const boardState = board.normalizedPositions;
		for (let i = 0; i < boardState.length; i++) {
			this.layers[0].nodes[i].input = boardState[i]
		}
		this.layers[0].lastNode.input = board.freePositions.length

		for (let i = 1; i < this.layers.length; i++) {
			this.layers[i].nodes.forEach(node => node.activateNode())
		}

		const probDist = softmax(this.lastLayer.nodes.map(node => node.val))
		const outputId = probRand(probDist)

		return outputId

	}

	get lastLayer() {
		return this.layers[this.layers.length - 1]
	}

}

class Layer {

	constructor() {
		this.nodes = []
	}

	set addNodes (node) {
		this.nodes.push(node)
	}

	set addConnections(x) {

		this.prevLayerBreadth = x
		this.nodes.forEach(node => {
			node.initWeights = x
		})
	}

	get lastNode() {
		return this.nodes[this.nodes.length - 1]
	}

}