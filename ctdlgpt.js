const fs = require('fs')

class Thought {
   constructor(text) {
      this.text = text;
      this.sorting = null;
      // this.color = null;
      // this.done = false;
   }

   toJSON() {
      return { text: this.text };
   }
}

class CTDLGPT {
   constructor() {
      this.thoughts = [];
   }

   create_thought(text) {
      let thought = new Thought(text);
      console.log(text, thought);
      this.thoughts.push(thought);
      return thought;
   }

   get_thoughts() {
      return this.thoughts;
   }

   _load_thoughts_from_file() {
      let thoughtfile = path.join(utils.get_userdir(), 'thoughts.json')

      fs.readFile(thoughtfile, 'utf8', (err, data) => {

	 if (err) {
	    switch(err.code) {
	       case 'ENOENT':
		  callback([])
		  break
	       default:
		  throw err
	    }
	    return
	 }

	 callback(JSON.parse(data))

      })
   }
}

module.exports.CTDLGPT = CTDLGPT;

