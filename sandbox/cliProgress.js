var clui = require('clui');
 
var Progress = clui.Progress;
 
var thisProgressBar = new Progress(20);
console.log(thisProgressBar.update(10, 30));
 
// or
 
var thisPercentBar = new Progress(20);
console.log(thisPercentBar.update(0.4));