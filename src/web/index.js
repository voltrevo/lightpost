'use strict'

var jQuery = require('jquery')
var lp = require('../index')

require('./installJqueryTerminal')

jQuery(document).ready(function($)
{
    var interpreter = new lp.interpreter()

    $('body').terminal(
        function(command, term)
        {
            interpreter.outputHandler = term.echo
            interpreter.errorHandler = term.error
            interpreter.handle_string(command + '\n');
        },
        {
            greetings: '',
            name: 'lightpost_terminal',
            prompt: '> '
        }
    );
});
