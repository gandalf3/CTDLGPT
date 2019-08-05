'use_strict';

function Thought(text) {
   this.text = text;

   this.elem = document.createElement("div");
   this.elem.classList.add("thought");
   this.elem.textContent = this.text;

   this.toJSON = function() {
      return { text: this.text };
   }
}

function ThoughtCanvas(canvas_container) {
   this.canvas_container = canvas_container;
   this.thoughts = [];

   this.add_thought = function(thought_text) {
      let thought = new Thought(thought_text)
      this.canvas_container.appendChild(thought.elem);
      this.thoughts.push(thought);

      window.save_thoughts(this.thoughts);
   }

   this.clap = () => {
      var clapdiv = document.createElement('div');
      clapdiv.textContent = "👏";
      clapdiv.style.position = "fixed";
      clapdiv.style.display = "inline-block";
      clapdiv.style.fontSize = 90 + "px";

      // let canvas_bounds = this.canvas.getBoundingClientRect();
      clapdiv.style.left = 0 + "px";
      clapdiv.style.top = 50 + "px";
      document.body.appendChild(clapdiv);

      window.setTimeout(() => {
	 clapdiv.remove();
	 clapdiv.animate = "change";
      }, 2000);
   }

   this.initialize_thoughtlist = (thoughtlist) => {
      for (thought of thoughtlist) {
	 this.add_thought(thought.text)
      }
   }

   window.load_thoughts(this.initialize_thoughtlist)

}

let canv = document.getElementById('thought-canvas-container');
var TC = new ThoughtCanvas(canv);

let inp = document.getElementById('input-bar-input')
inp.addEventListener('keyup', event => {
   if (event.code != 'Enter') { return; }

   TC.add_thought(inp.value);
   TC.clap();

   inp.value = '';
});

// focus the input by default
inp.focus();

// Adding a test thing hi;
