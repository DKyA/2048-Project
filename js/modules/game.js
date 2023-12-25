export class Game {
	constructor(board) {
		this.board = board;
	}

	up() {

		// Last accessible index
		const lai = Array.from({length: 4}, () => -1);

		// A shortcut
		const pos = this.board.positions;
		let moved = false;

		for (let i = 0; i < 4; i++) {

			for (let j = 0; j < 4; j++) {

				if (pos[i][j] === 0) continue;

				// check if I can merge to lai:
				if (lai[j] >= 0 && pos[lai[j]][j].val === pos[i][j].val && !pos[lai[j]][j].merged) {
					// I can merge:
					// Therefore I will nullify lai shift
					lai[j] --;
				}

				// Shift lai up one tile
				lai[j] ++;

				// If moving from same to same, dont...
				if (i === lai[j]) continue

				// Occupy the upper tile
				this.board.move([i, j], [lai[j], j])
				moved = true;

			}

		}

		return this.postProcess(moved);
	}

	left() {

		// A shortcut
		const pos = this.board.positions;
		let moved = false;

		for (let i = 0; i < 4; i++) {

			// Last accessible index
			let lai = -1

			for (let j = 0; j < 4; j++) {

				if (pos[i][j] === 0) continue;

				// check if I can merge to lai:
				if (lai >= 0 && pos[i][lai].val === pos[i][j].val && !pos[i][lai].merged) {
					// I can merge:
					// Therefore I will nullify lai shift
					lai --;
				}

				// Shift lai up one tile
				lai++;

				// If moving from same to same, dont...
				if (j === lai) continue;

				// Occupy the upper tile
				this.board.move([i, j], [i, lai])
				moved = true;

			}

		}

		return this.postProcess(moved);
	}
	down() {

		// Last accessible index
		const lai = Array.from({length: 4}, () => 4);

		// A shortcut
		const pos = this.board.positions;
		let moved = false;

		for (let i = 3; i >= 0; i--) {

			for (let j = 3; j >= 0; j--) {

				if (pos[i][j] === 0) continue;

				// check if I can merge to lai:
				if (lai[j] < 4 && pos[lai[j]][j].val === pos[i][j].val && !pos[lai[j]][j].merged) {
					// I can merge:
					// Therefore I will nullify lai shift
					lai[j] ++;
				}

				// Shift lai up one tile
				lai[j] --;

				// If moving from same to same, dont...
				if (i === lai[j]) continue;

				// Occupy the upper tile
				this.board.move([i, j], [lai[j], j])
				moved = true;

			}

		}


		return this.postProcess(moved);
	}
	right() {

		// A shortcut
		const pos = this.board.positions;
		let moved = false;

		for (let i = 3; i >= 0; i--) {

			// Last accessible index
			let lai = 4

			for (let j = 3; j >= 0; j--) {

				if (pos[i][j] === 0) continue;

				// check if I can merge to lai:
				if (lai < 4 && pos[i][lai].val === pos[i][j].val && !pos[i][lai].merged) {
					// I can merge:
					// Therefore I will nullify lai shift
					lai ++;
				}

				// Shift lai up one tile
				lai--;

				// If moving from same to same, dont...
				if (j === lai) continue;

				// Occupy the upper tile
				this.board.move([i, j], [i, lai])
				moved = true;

			}

		}
		return this.postProcess(moved);
	}

	postProcess(moved = false) {

		for (const tile of this.board.tiles) {
			tile.merged = false;
		}


		if (moved) {
			return {
				status: 100
			}
		}
		return {
			status: 200
		}
	}

}
