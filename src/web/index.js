'use strict'

var jQuery = require('jquery')
var lp = require('../index')

require('./installJqueryTerminal')

var InfoOverlay = require('info-overlay')
var readmeHtml = require('../../README.md')
var ribbon = require('./ribbon.html')

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

    var infoOverlay = InfoOverlay()

    infoOverlay.overlay.innerHTML = readmeHtml
    infoOverlay.overlay.appendChild(ribbon())

    document.body.appendChild(infoOverlay.icon)
});
