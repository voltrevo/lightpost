#!/usr/bin/env node

var lp = require('./index');
var rl = require('readline');
var fs = require('fs');

if (process.argv.length === 2)
{
    // No file provided; enter repl

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
}
else if (process.argv.length === 3)
{
    // Execute file

    var interpreter = new lp.interpreter;
    var program = fs.createReadStream(process.argv[2]);

    program.on(
        'data',
        function(data)
        {
            interpreter.handle_string(data.toString());
        });
}
else
{
    console.error('usage: node run.js [program]');
    process.exit(1);
}
