import { Tile } from "./tile.js";
import { spawnProbabilities } from "./helpers.js";

export class Board {

	constructor (live = false, world) {

		this.positions = Array.from(
			{ length: 4 }, 
			() => Array.from (
				{ length: 4 }, 
				() => 0
			)
		);

		this.tiles = [];
		this.freePositions = [];
		this.world = world;
		this.score = 0;

		this.live = live
		if (live) {
			this.boardElement = document.createElement('div');
			this.boardElement.classList.add("board")
		}

	}

	place () {
		this.world.appendChild(this.boardElement)
	}

	init() {

		for (let _ = 0; _ < 2; _++) {
			this.spawnTile()
		}

	}

	spawnTile() {

		let coords = [];

		this.freePositions = []
		for (let i = 0; i < this.positions.length; i++) {
			for (let j = 0; j < this.positions.length; j++) {
				if (this.positions[i][j] !== 0) continue
				this.freePositions.push([i, j])
			}
		}

		coords = this.freePositions[Math.floor(Math.random() * this.freePositions.length)]

		const value = spawnProbabilities();

		const new_tile = new Tile(value, coords)

		if (this.live) {
			new_tile.createHTML()
			new_tile.placed = true;

			// helps visuals:
			this.boardElement.appendChild(new_tile.html)
		}

		this.tiles.push(new_tile)
		this.positions[coords[0]][coords[1]] = new_tile;

		// Now, after filling in the spot, it is 0...
		if (this.freePositions.length === 1) {
			// Can I get out?
			return !this.checkEndgame()
		}
		// True => Can continue
		return true;

	}

	move(from, to) {

		let destroyedEl = {
			val: 0,
			coords: []
		}

		if (this.positions[to[0]][to[1]] !== 0) {
			destroyedEl = this.positions[to[0]][to[1]].selfDestroy(this.live && this.boardElement);
			this.positions[to[0]][to[1]] = 0
			this.positions[from[0]][from[1]].merged = true;
			this.score += destroyedEl.val * 2
		}

		// Value calculation:
		this.positions[from[0]][from[1]].update(
			[to[0], to[1]],
			this.positions[from[0]][from[1]].val + destroyedEl.val
		)

		this.positions[to[0]][to[1]] = this.positions[from[0]][from[1]]
		this.positions[from[0]][from[1]] = 0

	}

	checkEndgame() {

		for (let i = 0; i < 4; i++) {
			for(let j = 0; j < 4; j++) {
				// Checking next and bottom elements.
				if (i < 3 && this.positions[i][j].val === this.positions[i + 1][j].val) return false
				if (j < 3 && this.positions[i][j].val === this.positions[i][j + 1].val) return false
			}
		}

		// True => Endgame
		return true;

	}

	cleanup() {
		this.world.removeChild(this.boardElement)
	}

	get normalizedPositions() {

		const res = []

		for (const column of this.positions) {
			for (const item of column) {
				res.push(item === 0 ? 0 : item.val)
			}
		}

		return res

	}

	get maxTile () {

		let res = 0;

		for (const tile of this.tiles) {
			if (tile.val > res) {
				res = tile.val
			}
		}

		return res

	}

}

