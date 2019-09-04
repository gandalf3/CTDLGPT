// An object which contains everything used by our representation of a Thought
function Thought(text, props) {
   // store the actual data on in "this" so we can access it later
   this.text = text

   // what pile this thought has been sorted to
   // will be assigned to a string at some point
   if (typeof props.sorting !== 'undefined') {
     this.sorting = props.sorting
   }
  else {
    this.sorting = null
  }

   // are we done with this thought? of course not :(
   if (typeof props.done !== 'undefined') {
   this.done = props.done
     }
else {
  this.done = false
}

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


   // callback handler for plaindraggable, called when drag ends
   // currently we just return the element's position to normal, first
   // setting up the transition css properties so it glides back smoothly
   this.on_drag_end = () => {

      if (this.last_over_ev != null && this.last_over_ev.classList.contains('sort-box')) {
	// oh god this is NOT a good way to do this but whatever
	this.sorting = this.last_over_ev.parentElement.getAttribute('href').split('#')[1]
	// we just hope TC exists now eek
	TC.update()
      }

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

     document.removeEventListener('mousemove', this.over_sort_box)
    this.elem.style.pointerEvents = 'all'
   }

  // store the last element we were over
  this.last_over_ev = null
  this.over_sort_box = (ev) => {
    this.last_over_ev = document.elementFromPoint(ev.clientX, ev.clientY)
  }
  this.on_drag_start = () => {
     // disable pointer events so we can detect the element underneith
    this.elem.style.pointerEvents = 'none'
    document.addEventListener('mousemove', this.over_sort_box)
  }

   // draggable wants the element to actually exist in the document first, so we can't enable draggable until it's added.
   // so this function is to be called by whatever outside code actually inserts our this.elem into te document, after it has done so
   // this is a bit of a mess, but thats why this version of CTDLGPT is < skateboard
   this.dom_initialize = () => {
      this.draggable = new PlainDraggable(this.elem, {containment: {left: 0, top: 0, width:'100%', height:'100%'}})
      this.draggable.onDragStart = this.on_drag_start
      this.draggable.onDragEnd = this.on_drag_end
   }

   // this is a special function which is called by JSON.serialize(); returns the json representation for a Thought
   this.toJSON = function() {
      return { text: this.text, sorting: this.sorting, done: this.done };
   }
}
