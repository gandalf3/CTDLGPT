const utils = require('./utils')
const path = require('path')
const fs = require('fs')

class Thought {
   constructor(text, options) {
      this.text = text;
      this.sorting = null;

      if (options) {
	 if (options['sorting']) {
	    this.sorting = options['sorting'];
	 }
      }
      // this.color = null;
      // this.done = false;
   }

   toJSON() {
      return { text: this.text, sorting: this.sorting };
   }
}

class CTDLGPT {
   constructor() {
      this.thoughts = [];
     
      for (let item of this._load_thoughts_from_file()) {
	 this.thoughts.push(new Thought(item.text, item));
      }
   }

   create_thought(text) {
      let thought = new Thought(text);
      console.log(text, thought);
      this.thoughts.push(thought);
      return thought;
   }

   delete_thought(thought) {
      // find the index of the thought we're supposed to remove
      let idx = this.thoughts.indexOf(thought)
      // indexOf returns -1 if the item we're looking for (thought) doesn't exist, so we don't remove anything in that case
      if (idx != -1) { //
	 // delete 1 element starting at idx
	 this.thoughts.splice(idx, 1)
      }
   }

   get_thoughts() {
      console.log(this.thoughts);
      return this.thoughts;
   }

   save() {
      let thoughtfile = path.join(utils.get_userdir(), 'thoughts.json')

      fs.writeFile(thoughtfile, JSON.stringify(this.thoughts), (err) => {
	 if (err) {
	    console.log(err)
	 }
      });
   }

   _load_thoughts_from_file() {
      let thoughtfile = path.join(utils.get_userdir(), 'thoughts.json')

      if (!fs.existsSync(thoughtfile)) {
	 return [];
      }

      return JSON.parse(fs.readFileSync(thoughtfile, 'utf8'));
   }
}

module.exports.CTDLGPT = CTDLGPT;

