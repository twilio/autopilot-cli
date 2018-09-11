const CLI = require('clui'),
    Spinner = CLI.Spinner;
 
const countdown = new Spinner('Exiting in 10 seconds...  ', ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']);
 
countdown.start();
 
let number = 10;
setInterval(function () {
  number--;
  countdown.message('Exiting in ' + number + ' seconds...  ');
  if (number === 0) {
    process.stdout.write('\n');
    process.exit(0);
  }
}, 1000);