var post = require('post');

var interpreter = new post.interpreter;

process.stdin.on(
    'data',
    function(data)
    {
        interpreter.handle_string(data.toString());
    });
