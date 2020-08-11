const fs = require('fs');

const buffer = './node_modules/node-libs-browser/node_modules/buffer/index.js';
const fix = "./readBigUInt64BE.js";

fs.readFile(buffer, (bufferErr, bufferCode) => {
  if (bufferErr) throw bufferErr; 

  fs.readFile(fix, (fixErr, fixCode) => {
    if (fixErr) throw fixErr; 

    fs.writeFile(buffer, bufferCode + fixCode, 'utf8', (err) => {
      if (err) throw err;

      console.log('Successfully added readBigUInt64BE to Buffer.');
    }) 
  });
});
