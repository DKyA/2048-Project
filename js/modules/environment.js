class GetEnvironment {
	constructor () {
		this.scoreboard = document.querySelector("[score]");
		this.best = document.querySelector("[best]");
		this.titlescreen = document.querySelector("[js-endgame]")
		this.titlefield = document.querySelector("[js-title]")
		this.titlescore = document.querySelector("[js-text]")
		this.restart = document.querySelectorAll("[js-restart]")
	}

		endgame (game) {

		this.titlescreen.classList.add("endgame--visible");
		this.titlefield.innerHTML = "You Lose"
		this.titlescore.innerHTML = "Final score: " + game.board.score;

	}

	hideTitleScreen() {
		this.titlescreen.classList.remove("endgame--visible");
	}

	set score (score) {
		this.scoreboard.innerHTML = score;
	}
	set pb (score) {
		this.best.innerHTML = score;
	}

}

export const Environment = new GetEnvironment()