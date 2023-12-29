export class Tile {
	constructor (val, coords) {

		this.val = val
		this.coords = coords
		this.html = null
		this.placed = false

	}

	createHTML() {

		this.html = document.createElement("div");
		this.html.classList.add("tile")
		this.setAttributes()
		const inner_text = document.createElement("p")
		inner_text.innerHTML = this.val
		this.html.appendChild(inner_text);
		// Appear animation
		setTimeout(() => {
			this.html.classList.add("spawned")
		}, 200);

	}

	update(newCoords, newValue) {

		this.coords = newCoords;
		this.val = newValue;
		if (this.placed) {
			this.setAttributes()
		}

	}

	setAttributes() {
		this.html.setAttribute("position", `${this.coords[0]}-${this.coords[1]}`)
		this.html.setAttribute("value", this.val)
		if (this.placed) {
			setTimeout(() => {
				this.html.children[0].innerHTML = this.val
			}, 200);
		}
	}

	selfDestroy(boardHTML) {

		if (this.placed) {
			this.html.setAttribute("destroy", "true")

			if (boardHTML) {
				setTimeout(() => {
					boardHTML.removeChild(this.html)
				}, 200);
			}
		}
		return {
			coords: this.coords,
			val: this.val
		}

	}

}