import { controls } from "./humancycle.js"

class GetEnvironment {
	constructor () {
		this.container = document.querySelector("[js-text-container]")
		this.panel = document.querySelector("[js-panel]")
		this.body = document.querySelector("body")

		this.accessors = {}
		this.valueshortcuts = {} // Minimize DOM interactions
	}

	initCPDashboard(noOfGames) {

		this.typeofgame = "Computer";
		this.noOfGames = noOfGames;
		this.valueshortcuts["score"] = [];
		this.valueshortcuts["maxTiles"] = [];

		// If I have just one robo game, make it behave
		// Like a human game.
		if (noOfGames === 1) return this.initHumanDashboard();

		// Create a table with scores of everyone:

		// Initially, lets create the structure:
		const table = document.createElement("div")
		table.classList.add("table")

		// Colnames
		const columns = ["Game", "Score", "Max Tile"]
		// Create table structure -> passing param to css:
		table.style=`--cols: ${columns.length}`;

		this.accessors["columns"] = [];
		for (const column of columns) {
			const th = document.createElement("p")
			this.accessors["columns"].push([th])
			th.innerHTML = column
			th.classList.add("table__td", "table__td--headline")
			table.appendChild(th)
		}

		for (let i = 0; i < noOfGames + 1; i++) {

			for (let j = 0; j < this.accessors.columns.length; j++) {
				const td = document.createElement("p")
				td.classList.add("table__td");
				td.innerHTML = (j === 0) ? (i === noOfGames) ? "Avg" : i : 0; // Please dont ask.
				this.accessors.columns[j].push(td);
				table.appendChild(td)
			}

		}

		this.container.appendChild(table)

	}

	initHumanDashboard(){

		this.typeofgame = "Human";

		const texts = ["Score", "Best"]

		// Create two rows: One for score, the other for best
		for (let i = 0; i < 2; i++) {
			const rowEl = document.createElement("div");
			rowEl.classList.add("inforow");
			for (let j = 0; j < 2; j++) {
				// Two cells with info:
				const text = document.createElement("p");
				text.classList.add('inforow__box');

				// First is text, the other is attribute
				if (j === 0) {
					text.innerHTML = texts[i]
				} else {
					text.setAttribute(texts[i].toLowerCase(), "")

					// Setting up accessors for updates
					this.accessors[texts[i].toLowerCase()] = text
					this.valueshortcuts[texts[i].toLowerCase()] = 0
				}
				rowEl.appendChild(text)
			}
			this.container.appendChild(rowEl)
		}

		// Reset button:
		const resetBtn = document.createElement("button")
		resetBtn.classList.add("button")
		resetBtn.setAttribute("js-restart", "")
		resetBtn.innerHTML = "Restart"

		this.panel.appendChild(resetBtn)

		// Create a control panel for mobile devices:
		const mobileHolder = document.createElement("div")
		mobileHolder.classList.add('mobiles')

		controls.map(control => {
			const btn = document.createElement("button")
			btn.classList.add("button")
			btn.setAttribute("js-mobile-controls", control)
			btn.innerHTML = control[0].toUpperCase()
			mobileHolder.appendChild(btn)
		})

		this.body.appendChild(mobileHolder)

		// Create GameOver screen:
		const egContainer = document.createElement("div")
		egContainer.classList.add("endgame")
		const egTitle = document.createElement("h2")
		const egText = document.createElement('p')
		const egBtn = document.createElement("button")
		egBtn.classList.add("button")
		egBtn.setAttribute("js-restart", "")
		egBtn.innerHTML = "Restart"

		for (const el of [egTitle, egText, egBtn]) {
			egContainer.appendChild(el)
		}

		this.body.appendChild(egContainer)

		this.accessors["egTitle"] = egTitle
		this.accessors["egText"] = egText
		this.accessors["egContainer"] = egContainer

	}

	endgame (game) {

		this.accessors["egContainer"].classList.add("endgame--visible");
		this.accessors["egTitle"].innerHTML = "You Lose"
		this.accessors["egText"].innerHTML = "Final score: " + game.board.score;

	}

	hideTitleScreen() {
		this.accessors["egContainer"].classList.remove("endgame--visible");
	}

	setScore (score, maxTile = null, i = null) {
		// Last safety check
		if (this.typeofgame === "Human" && this.accessors['score']) {
			this.accessors["score"].innerHTML = score

			if (score > this.valueshortcuts["best"]) {
				this.valueshortcuts["best"] = score
				this.accessors["best"].innerHTML = score;
			}

		}
		else {
			this.accessors.columns[1][i + 1].innerHTML = score; // Row 1 = labels
			this.valueshortcuts["score"][i] = score // For stats
			if (maxTile) {
				this.accessors.columns[2][i + 1].innerHTML = maxTile;
				this.valueshortcuts["maxTiles"][i] = maxTile;
			}
		}

	}

	stats() {

		// Avg of scores:
		const avg = Math.round((this.valueshortcuts["score"].reduce((tot, a) => tot + a, 0)) / this.noOfGames, 0)
		this.accessors.columns[1][this.accessors.columns[1].length - 1].innerHTML = avg

		// Median of Max Tiles:
		const median = this.valueshortcuts["maxTiles"].sort((a, b) => a - b)[Math.floor(this.noOfGames / 2)]
		this.accessors.columns[2][this.accessors.columns[2].length - 1].innerHTML = median

	}

}

export const Environment = new GetEnvironment()