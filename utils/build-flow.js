const fs = require('fs-extra')
const path = require('path')

const PROCESS_DIR = process.cwd();

const destDir = path.join(PROCESS_DIR,'../fluidum-cloud/public-public')
const srcDir = path.join(PROCESS_DIR,'dist/fluidum')

console.log(srcDir)
console.log(destDir)
fs.emptyDirSync(destDir)

      


// To copy a folder or file  
fs.copy(srcDir, destDir, function (err) {
    console.log(srcDir)
  if (err) {                 
    console.error(err);   //   |___{ overwrite: true } // add if you want to replace existing folder or file with same name
  } else {
    console.log("success!");
  }
});