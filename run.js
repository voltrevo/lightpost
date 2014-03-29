var lp = require('lightpost');
var fs = require('fs');

if (process.argv.length < 3)
{
    console.error('usage: node run.js program');
    process.exit(1);
}

var interpreter = new lp.interpreter;
var program = fs.createReadStream(process.argv[2]);

program.on(
    'data',
    function(data)
    {
        interpreter.handle_string(data.toString());
    });
