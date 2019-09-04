'use_strict';

// A class which contains everything used by our representation of a Thougt
function Thought(text) {
   this.text = text;

   this.elem = document.createElement("div");
   this.elem.classList.add("thought");
   this.elem.textContent = this.text;

   // add a closebutton <div> and register a click event listener which removes ourselves
   let closebtn = document.createElement('button')
   closebtn.classList.add("closebutton")
   closebtn.textContent = 'X'
   closebtn.addEventListener('click', (ev) => {
      TC.remove_thought(this)
   })
   this.elem.appendChild(closebtn)

   // this.elem.setAttribute('draggable', true)
   // this.elem.addEventListener('dragstart', (ev) => {
   //    console.log(ev)
   // })

   // document.body.appendChild(this.elem)
   this.draggable = null

   this.remove = () => {
      this.elem.remove()
   }

   this.return_to_start = () => {
      this.draggable.disabled = true
      this.elem.style.transition = 'transform .5s'
      this.elem.style.transform = 'translate(0, 0)'
      window.setTimeout(() => {
	 this.elem.style.transition = 'initial'
	 this.draggable.position() // tell PlainDraggable to recalculate its internal idea of the element's position
	 this.draggable.disabled = false
      }, 500)
   }

   this.dom_initialize = () => {
      this.draggable = new PlainDraggable(this.elem, {containment: {left: 0, top: 0, width:'100%', height:'100%'}})
      this.draggable.onDragEnd = this.return_to_start
   }

   // this is a special function which is called by JSON.serialize(); returns the json representation for a Thought
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
      thought.dom_initialize()
      this.thoughts.push(thought);

      window.save_thoughts(this.thoughts);
   }

   this.remove_thought = function(thought) {
      let idx = this.thoughts.indexOf(thought)

      // indexOf returns -1 if thought doesn't exist, so we don't remove anything in that case
      if (idx != -1) { //
	 // delete 1 element starting at idx
	 this.thoughts.splice(idx, 1)
      }
      thought.remove()

      window.save_thoughts(this.thoughts)
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

// 

// Adding a test thing hi;
