function ThoughtCanvas(canvas_container, sorting_type) {
   this.canvas_container = canvas_container;
   this.thoughts = [];
   this.sort_filter = sorting_type

   // this function creates a new Thought instance and adds its element (elem)
   // to the thought canvas it also stores it in an array (this.thoughts) and
   // saves the json representation to a file using the preloaded
   // window.save_thoughts function (from preload.js)
   this.add_thought = function(text, props) {
      let thought = new Thought(text, props)

      // just don't display it if it's not for us, still store it I guess
      if (thought.sorting == this.sort_filter) {
	 this.canvas_container.appendChild(thought.elem);
	 thought.dom_initialize()
      }
      this.thoughts.push(thought);

      // TODO oh geez we do this every thought we load thats dumb
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

   // yay O(1) algorithms for no reason woo
   this.update = () => {
      console.log('excusme')
      window.save_thoughts(this.thoughts)
      // the brute-force way
      for (thought of this.thoughts) {
	 if (thought.sorting != this.sort_filter) {
	    thought.remove()
	 }
	 if (thought.draggable) {
	    thought.draggable.position()
	 }
      }
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
	    this.add_thought(thought.text, thought)
      }
   }

   // load the list of thoughts from the file (window.load_thoughts is from preload.js)
   window.load_thoughts(this.initialize_thoughtlist)

}
