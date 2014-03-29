var lp = require('lightpost');
var rl = require('readline');

var interpreter = new lp.interpreter;

var i = rl.createInterface(process.stdin, process.stdout, null);

process.stdout.write('> ');

i.on(
    'line',
    function(line)
    {
        interpreter.handle_string(line + '\n');
        process.stdout.write('> ');
    });

i.on(
    'close',
    function()
    {
        process.stdout.write('\b\b');
    });
