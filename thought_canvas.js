'use_strict';


// A class which contains everything used by our representation of a Thought
function Thought(text) {
   // store the actual data on in "this" so we can access it later
   this.text = text;

   // we'll use this.draggable for storing the PlainDraggable object associated
   // with this.elem later on, see this.dom_initialize
   this.draggable = null

   // construct a div to represent the thought, give it a class so we can style
   // it with css, and also put our text inside of it
   this.elem = document.createElement("div");
   this.elem.classList.add("thought");
   this.elem.textContent = this.text;

   // add a "closebutton" <div> and register a click event listener to remove
   // this thought on click. We don't need to access this later so don't bother
   // storing a reference to it in this
   let closebtn = document.createElement('button')
   closebtn.classList.add("closebutton")
   closebtn.textContent = 'X'
   closebtn.addEventListener('click', (ev) => {
      TC.remove_thought(this)
   })
   // insert the "closebutton" div in the thought div
   this.elem.appendChild(closebtn)

   // function for other code to call when they want to remove us 
   this.remove = () => {
      // for now all we do is remove this.elem from the document
      this.elem.remove()
   }

   // callback handler for plaindraggable, called when drag ends
   // currently we just return the element's position to normal, first
   // setting up the transition css properties so it glides back smoothly
   this.return_to_start = () => {
      // disable dragging while it goes back
      this.draggable.disabled = true
      this.elem.style.transition = 'transform .5s'
      this.elem.style.transform = 'translate(0, 0)'

      // after .5s (500ms) we re-enable dragging and turn off the transition stuff
      // it's a bit hackish but we can fix problems it creates when they show up I suppose
      window.setTimeout(() => {
	 this.elem.style.transition = 'initial'
	 // tell PlainDraggable to recalculate its internal idea of the element's position, now that we've changed it
	 this.draggable.position() 
	 this.draggable.disabled = false
      }, 500)
   }

   // draggable wants the element to actually exist in the document first, so we can't enable draggable until it's added.
   // so this function is to be called by whatever outside code actually inserts our this.elem into te document, after it has done so
   // this is a bit of a mess, but thats why this version of CTDLGPT is < skateboard
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

   // this function creates a new Thought instance and adds its element (elem)
   // to the thought canvas it also stores it in an array (this.thoughts) and
   // saves the json representation to a file using the preloaded
   // window.save_thoughts function (from preload.js)
   this.add_thought = function(thought_text) {
      let thought = new Thought(thought_text)
      this.canvas_container.appendChild(thought.elem);
      thought.dom_initialize()
      this.thoughts.push(thought);

      window.save_thoughts(this.thoughts);
   }

   // removes the provided thought from the array and saves it
   this.remove_thought = function(thought) {

      // find the index of the thought we're supposed to remove
      let idx = this.thoughts.indexOf(thought)
      // indexOf returns -1 if the item we're looking for (thought) doesn't exist, so we don't remove anything in that case
      if (idx != -1) { //
	 // delete 1 element starting at idx
	 this.thoughts.splice(idx, 1)
      }
      // also tell the thought instance to remove its stuff
      thought.remove()

      window.save_thoughts(this.thoughts)
   }

   // :clap:
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

   // add thoughts for all the thoughts in a list
   this.initialize_thoughtlist = (thoughtlist) => {
      for (thought of thoughtlist) {
	 this.add_thought(thought.text)
      }
   }

   // load the list of thoughts from the file (window.load_thoughts is from preload.js)
   window.load_thoughts(this.initialize_thoughtlist)

}

// Create a single ThougtCanvas object and give it the thought canvas container
// element already in the html file
let canv = document.getElementById('thought-canvas-container');
var TC = new ThoughtCanvas(canv);

// Set a key release event listener on the input element to listen for releases
// of "enter" and add its content to the ThoughtCanvas when it finds one
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
