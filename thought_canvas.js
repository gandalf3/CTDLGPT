'use_strict';


function Thought(text) {
	this.text = text;
	this.size = {x: null, y: null};
	this.color = null;
}

function ThoughtCanvas(canvas_elem) {
	this.canvas = canvas_elem;
	this.ctx = canvas_elem.getContext('2d');
	this.thoughts = [];

	this.add_thought = function(thought) {
		this.thoughts.push(thought);
	}


	// draw a single thought to the canvas at position x, y
	this.draw_thought = (thought, x, y) => {
		let padding = 10;
		this.ctx.font = '12px sans-serif';
		let textsize = this.ctx.measureText(thought.text);

		thought.size.x = 2*padding+textsize.width;
		thought.size.y = 2*padding;


		this.ctx.fillStyle = 'pink';
		this.ctx.fillRect(x, y, thought.size.x, thought.size.y);

		this.ctx.fillStyle = 'black';
		this.ctx.fillText(thought.text, x+padding, y+padding);
	}

	// draw all thoughts in this.thoughts to the canvas
	this.draw = () => {
		// blank everything
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		var next_x = 0;
		for (let i=0; i<this.thoughts.length; i++) {
			next_x += ( i == 0 ? 0 : this.thoughts[i-1].size.x + 10);
			this.draw_thought(this.thoughts[i], next_x, 10);
		}
	}
}

let canv = document.getElementById('thought-canvas');
var TC = new ThoughtCanvas(canv);

let inp = document.getElementById('input-bar-input')
inp.addEventListener('keyup', event => {
	if (event.code != 'Enter') { return; }

	TC.add_thought(new Thought(inp.value));
	TC.draw();

	inp.value = '';
});


// exports.Thought = Thought;
// exports.ThoughtCanvas = ThoughtCanvas;
// Adding a test thing hi;
