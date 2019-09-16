'use_strict';

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
