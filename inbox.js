'use_strict';

// Create a single ThougtCanvas object and give it the thought canvas container
// element already in the html file
let canv = document.getElementById('thought-canvas-container');
var TC = new ThoughtCanvas(canv, null);

// Set a key release event listener on the input element to listen for releases
// of "enter" and add its content to the ThoughtCanvas when it finds one
let inp = document.getElementById('input-bar-input')
inp.addEventListener('keyup', event => {
   if (event.code != 'Enter') { return; }

   TC.add_thought(inp.value, {});
   TC.clap();

   inp.value = '';
});

// focus the input by default
inp.focus();


// Adding a test thing hi;
