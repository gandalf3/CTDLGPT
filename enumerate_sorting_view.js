// get sorting type code
let sorting_type = document.location.href.split('#')[1]

let canv = document.getElementById('thought-canvas-container');
var TC = new ThoughtCanvas(canv, sorting_type);

let title = document.getElementById('title')
title.textContent = sorting_type
