'use_strict';

const CTDLGPT = window.CTDLGPT;

class DragSystem {
  constructor(element, options) {
    // if (onDrop in options) {};
    this.elem = element;
    this.elem.addEventListener('mousedown', this.handle_drag_start.bind(this));
    this.store_initial_styles();
    this.placeholder_elem = null;

    this._initialize();
  }

  handle_drag_start(ev) {
    ev.preventDefault();
    DragSystem._active = this;

    // get our elements position and dimensions in client coordinates
    let rect = this.elem.getBoundingClientRect();
    console.log(rect);
    console.log(this.elem.getClientRects());

    // make copy (the bool argument is for deep copy) of our element, to stick
    // in the dom in place of our element in order to hold the layout together
    this.placeholder_elem = this.elem.cloneNode(true);
    this.placeholder_elem.style.visibility = 'hidden';
    this.elem.insertAdjacentElement('beforebegin', this.placeholder_elem);


    // let compstyle = window.getComputedStyle(this.elem);
    // offsets to keep element positioned the same relative to the cursor
    let x_offset = rect.x - ev.clientX;
    let y_offset = rect.y - ev.clientY;

    // get initial offsets, to avoid the element jumping to the top left corner
    // until the first mousemove event fires
    let x = ev.clientX;
    let y = ev.clientY;

    this.store_initial_styles();

    this.elem.style.position = 'absolute';
    this.elem.style.margin = '0';
    this.elem.style.top = `${y_offset}px`;
    this.elem.style.left = `${x_offset}px`;
    this.elem.style.transform = `translate(${x}px, ${y}px)`;

  }

  handle_drag_stop(ev) {
    this.placeholder_elem.remove();
    this.restore_initial_styles();
  }

  cleanup() {
    // document.removeEventListener('mousemove', this.handle_drag);
  }

  store_initial_styles() {
    this.initial_styles = {
      'position':  this.elem.style.position,
      'margin':    this.elem.style.margin,
      'top':       this.elem.style.top,
      'left':      this.elem.style.left,
      'transform': this.elem.style.transform,
    };
  }
  restore_initial_styles() {
    this.elem.style.position  = this.initial_styles.position;
    this.elem.style.margin    = this.initial_styles.margin;
    this.elem.style.top       = this.initial_styles.top;
    this.elem.style.left      = this.initial_styles.left;
    this.elem.style.transform = this.initial_styles.transform;
  }

  handle_drag(ev) {
    let x = ev.clientX;
    let y = ev.clientY;
    this.elem.style.transform = `translate(${x}px, ${y}px)`
  }

  static _global_drag_handler(ev) {
    if (!DragSystem._active) { return };
    DragSystem._active.handle_drag(ev);
  }

  static _global_drag_stop_handler(ev) {
    if (!DragSystem._active) { return };
    DragSystem._active.handle_drag_stop(ev);
    DragSystem._active = null;
  }

  _initialize() {
    if (DragSystem._initialized) { return; }

    document.addEventListener('mousemove', DragSystem._global_drag_handler, {'passive': true});
    document.addEventListener('mouseup', DragSystem._global_drag_stop_handler, {'passive': true});

    DragSystem._initialized = true;
  }

}
DragSystem._initialized = false;
DragSystem._mousemove = null;
DragSystem._active = null;

class ThoughtInput {
  constructor(input_element) {

    this.elem = document.createElement('textarea');
    this.callback = null;

    this.elem.addEventListener('keyup', event => {
      if (event.code != 'Enter') { return; }

      let thought = CTDLGPT.create_thought(this.elem.value);

      if (this.callback) { this.callback(thought) };

      this.elem.value = '';
    });

  }

  set_callback(callback) {
    this.callback = callback;
  }

}

// An object which contains everything used by our representation of a Thought
class ThoughtDisplay {
  constructor(thought) {
    console.log("started with", thought);
    // store the actual data on in "this" so we can access it later
    this.thought = thought;

    // construct a div to represent the thought, give it a class so we can style
    // it with css, and also put our text inside of it
    this.elem = document.createElement("div");
    this.elem.classList.add("thought");
    this.elem.textContent = this.thought.text;

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

    //checkmark button thing
    let checkbtn = document.createElement('button')
    checkbtn.classList.add("checkbutton")
    checkbtn.textContent = '✔'
    //checkbtn.addEventListener('click', (ev) => {
    // TC.sort_thought(this)
    // })

    this.elem.appendChild(checkbtn)

    // function for other code to call when they want to remove us 
    this.remove = () => {
      // for now all we do is remove this.elem from the document
      this.elem.remove()
    }

    new DragSystem(this.elem);

    // this._dragstart = false;
    // this.dragging = false;
    //
    // this.elem.addEventListener('mousedown', (ev) => {
    //   this._dragstart = true;
    //   console.log("dragstart");
    // });
    //
    // this.elem.addEventListener('mousemove', (ev) => {
    //   if (this._dragstart) {
	// this.dragging = true;
	// this._dragstart = false;
    //   }
    //   if (! this.dragging) { return; }
    //   console.log("dragging");
    // });
    //
    // document.addEventListener('mouseup', (ev) => {
    //   if (this.dragging) {
	// this.dragging = false;
    //   }
    //   console.log("dragstop")
    // });
    //

    // callback handler for plaindraggable, called when drag ends
    // currently we just return the element's position to normal, first
    // setting up the transition css properties so it glides back smoothly
    // this.on_drag_end = () => {
    //
    //   if (this.last_over_ev != null && this.last_over_ev.classList.contains('sort-box')) {
	// // oh god this is NOT a good way to do this but whatever
	// this.sorting = this.last_over_ev.parentElement.getAttribute('href').split('#')[1]
	// // we just hope TC exists now eek
	// TC.update()
    //   }
    //
    //   // disable dragging while it goes back
    //   this.draggable.disabled = true
    //   this.elem.style.transition = 'transform .5s'
    //   this.elem.style.transform = 'translate(0, 0)'
    //
    //   // after .5s (500ms) we re-enable dragging and turn off the transition stuff
    //   // it's a bit hackish but we can fix problems it creates when they show up I suppose
    //   window.setTimeout(() => {
	// this.elem.style.transition = 'initial'
	// // tell PlainDraggable to recalculate its internal idea of the element's position, now that we've changed it
	// this.draggable.position() 
	// this.draggable.disabled = false
    //   }, 500)
    //
    //   document.removeEventListener('mousemove', this.over_sort_box)
    //   this.elem.style.pointerEvents = 'all'
    // }
    //
    // // store the last element we were over
    // this.last_over_ev = null
    // this.over_sort_box = (ev) => {
    //   this.last_over_ev = document.elementFromPoint(ev.clientX, ev.clientY)
    // }
    // this.on_drag_start = () => {
    //   // disable pointer events so we can detect the element underneith
    //   this.elem.style.pointerEvents = 'none'
    //   document.addEventListener('mousemove', this.over_sort_box)
    // }
    //
    // // draggable wants the element to actually exist in the document first, so we can't enable draggable until it's added.
    // // so this function is to be called by whatever outside code actually inserts our this.elem into te document, after it has done so
    // // this is a bit of a mess, but thats why this version of CTDLGPT is < skateboard
    // this.dom_initialize = () => {
    //   this.draggable = new PlainDraggable(this.elem, {containment: {left: 0, top: 0, width:'100%', height:'100%'}})
    //   this.draggable.onDragStart = this.on_drag_start
    //   this.draggable.onDragEnd = this.on_drag_end
    // }
    //
    // // this is a special function which is called by JSON.serialize(); returns the json representation for a Thought
    // this.toJSON = function() {
    //   return { text: this.text, sorting: this.sorting, done: this.done };
    // }
  }
}


class ThoughtCanvas {
  constructor(container_element) {
    this.canvas_container = container_element;
    this.thoughts = [];

    // this.controls = ThoughtCanvasControls
    this.thought_input = new ThoughtInput();
    this.canvas_container.appendChild(this.thought_input.elem)

    this.thought_input.callback = function(thought) {
      console.log("callback", this, thought);
      this.clap();
      this.add_thought(thought);
    }.bind(this);
  }

  // this function creates a new Thought instance and adds its element (elem)
  // to the thought canvas it also stores it in an array (this.thoughts) and
  // saves the json representation to a file using the preloaded
  // window.save_thoughts function (from preload.js)
  add_thought(thought) {
    console.log("adding", thought);
    let td = new ThoughtDisplay(thought)
    this.canvas_container.appendChild(td.elem);
  }

  // removes the provided thought from the array and saves it
  remove_thought(thought) {

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
  update() {
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
  clap() {
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
  // initialize_thoughtlist(thoughtlist) {
  //   for (thought of thoughtlist) {
  //     this.add_thought(thought.text, thought)
  //   }
  // }

  focus() {
    this.thought_input.elem.focus();
  }

  // load the list of thoughts from the file (window.load_thoughts is from preload.js)
  // window.load_thoughts(this.initialize_thoughtlist)

}
