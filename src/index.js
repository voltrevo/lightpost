'use strict';

function check_type_pair(a, b, type)
{
    return (typeof a === type && typeof b === type);
}

exports.interpreter = function(outputHandler, errorHandler, getLine)
{
    var self = this;

    this.outputHandler = outputHandler || function(){};
    this.errorHandler = errorHandler || function(){};
    this.getLine = getLine || null;

    this.builtin_functions =
    {
        '+':
        {
            argc: 2,
            exec: function(a, b)
            {
                if (!check_type_pair(a, b, 'number') && !check_type_pair(a, b, 'string'))
                {
                    self.errorHandler('Error: +: arguments must be numbers or strings');
                    return;
                }

                return a + b;
            }
        },
        '-':
        {
            argc: 2,
            exec: function(a, b)
            {
                if (!check_type_pair(a, b, 'number'))
                {
                    self.errorHandler('Error: -: arguments must be numbers');
                    return;
                }

                return a - b;
            }
        },
        '*':
        {
            argc: 2,
            exec: function(a, b)
            {
                if (!check_type_pair(a, b, 'number'))
                {
                    self.errorHandler('Error: *: arguments must be numbers');
                    return;
                }

                return a * b;
            }
        },
        '/':
        {
            argc: 2,
            exec: function(a, b)
            {
                if (!check_type_pair(a, b, 'number'))
                {
                    self.errorHandler('Error: /: arguments must be numbers');
                    return;
                }

                return a / b;
            }
        },
        '%':
        {
            argc: 2,
            exec: function(a, b)
            {
                if (!check_type_pair(a, b, 'number'))
                {
                    self.errorHandler('Error: /: arguments must be numbers');
                    return;
                }

                return a % b;
            }
        },
        '**':
        {
            argc: 2,
            exec: function(a, b)
            {
                if (!check_type_pair(a, b, 'number'))
                {
                    self.errorHandler('Error: **: arguments must be numbers');
                    return;
                }

                return Math.pow(a, b);
            }
        },
        '<':
        {
            argc: 2,
            exec: function(a, b)
            {
                if (!check_type_pair(a, b, 'number') && !check_type_pair(a, b, 'string'))
                {
                    self.errorHandler('Error: <: arguments must be numbers or strings');
                    return;
                }

                return a < b;
            }
        },
        '>':
        {
            argc: 2,
            exec: function(a, b)
            {
                if (!check_type_pair(a, b, 'number') && !check_type_pair(a, b, 'string'))
                {
                    self.errorHandler('Error: >: arguments must be numbers or strings');
                    return;
                }

                return a > b;
            }
        },
        '<=':
        {
            argc: 2,
            exec: function(a, b)
            {
                if (!check_type_pair(a, b, 'number') && !check_type_pair(a, b, 'string'))
                {
                    self.errorHandler('Error: <=: arguments must be numbers or strings');
                    return;
                }

                return a <= b;
            }
        },
        '>=':
        {
            argc: 2,
            exec: function(a, b)
            {
                if (!check_type_pair(a, b, 'number') && !check_type_pair(a, b, 'string'))
                {
                    self.errorHandler('Error: >=: arguments must be numbers or strings');
                    return;
                }

                return a >= b;
            }
        },
        '==':
        {
            argc: 2,
            exec: function(a, b) { return a === b; }
        },
        '!=':
        {
            argc: 2,
            exec: function(a, b) { return a !== b; }
        },
        '!':
        {
            argc: 1,
            exec: function(x)
            {
                if (typeof x !== 'boolean')
                {
                    self.errorHandler('Error: !: argument must be a boolean');
                }

                return !x;
            }
        },
        'rand':
        {
            argc: 0,
            exec: function() { return Math.random(); }
        },
        'print':
        {
            argc: 1,
            exec: function(s) { self.outputHandler(s); }
        },
        'inspect':
        {
            argc: 0,
            exec: function()
            {
                self.outputHandler('Stack: ' + JSON.stringify(self.innermost_exec_layer.stack));

                self.outputHandler(
                    'Variables: ' + JSON.stringify(self.innermost_exec_layer.variables)
                );

                self.outputHandler('Module Variables: ' + JSON.stringify(self.module_variables));
            }
        },
        'exec':
        {
            argc: 1,
            exec: function(fn)
            {
                if (typeof fn !== 'object')
                {
                    self.errorHandler('Error: exec: argument is not a function');
                    return;
                }

                if (fn.type === 'variable')
                {
                    var value = self.innermost_exec_layer.variables[fn.name];

                    if (typeof value !== 'object')
                    {
                        self.errorHandler('Error: exec: variable argument is not a function');
                        return;
                    }

                    self.innermost_exec_layer.exec(value);
                }
                else if (fn.type === 'function')
                {
                    self.innermost_exec_layer.exec(fn.value);
                }
                else
                {
                    throw new Error('Unrecognised type ' + fn.type);
                }
            }
        },
        '=':
        {
            argc: 0,
            exec: function()
            {
                // Check the stack can provide the arguments required
                if (self.innermost_exec_layer.stack.length < 2)
                {
                    self.errorHandler('Error: Not enough arguments for assignment');
                    self.innermost_exec_layer.stack.length = 0;
                    return;
                }

                var args = self.innermost_exec_layer.stack.splice(self.innermost_exec_layer.stack.length - 2, 2);

                if (typeof args[0] !== 'object' || (args[0].type !== 'variable' && args[0].type !== 'module_variable'))
                {
                    self.errorHandler('Error: First argument to assignment is not a variable');
                    return;
                }

                if (typeof args[1] === 'object')
                {
                    if (args[1].type === 'variable')
                    {
                        var value = self.innermost_exec_layer.variables[args[1].name];

                        if (value === undefined)
                        {
                            self.errorHandler('Error: Cannot assign ' + args[0].name + ' to undefined variable ' + args[1].name);
                            return;
                        }

                        args[1] = value;
                    }
                    else if (args[1].type === 'module_variable')
                    {
                        var value = self.module_variables[args[1].name];

                        if (value === undefined)
                        {
                            self.errorHandler('Error: Cannot assign ' + args[0].name + ' to undefined variable ' + args[1].name);
                            return;
                        }

                        args[1] = value;
                    }
                    else if (args[1].type === 'function')
                    {
                        args[1] = args[1].value;
                    }
                    else
                    {
                        throw new Error('Unrecognised type ' + args[1].type);
                    }
                }

                if (args[0].type === 'variable')
                {
                    self.innermost_exec_layer.variables[args[0].name] = args[1];
                }
                else if (args[0].type === 'module_variable')
                {
                    self.module_variables[args[0].name] = args[1];
                }
                else
                {
                    throw new Error('Unexpected variable type ' + args[0].type);
                }
            }
        },
        'pull':
        {
            argc: 1,
            exec: function(n)
            {
                self.innermost_exec_layer.pull(n);
            }
        },
        'dup':
        {
            argc: 0,
            exec: function()
            {
                var stack = self.innermost_exec_layer.stack;

                if (stack.length === 0)
                {
                    self.errorHandler('Error: dup: nothing in stack to duplicate');
                    return;
                }

                stack.push(stack[stack.length - 1]);
            }
        },
        'if':
        {
            argc: 2,
            exec: function(fn, condition)
            {
                if (condition)
                {
                    self.builtin_functions.exec.exec(fn);
                }
            }
        },
        'if_else':
        {
            argc: 3,
            exec: function(fn_true, fn_false, condition)
            {
                self.builtin_functions.exec.exec(condition ? fn_true : fn_false);
            }
        },
        'readline':
        {
            argc: 0,
            exec: function()
            {
                if (!self.getLine) {
                    self.errorHandler('Error: readline: not available')
                    return
                }

                // Turn on buffering while we wait for user input
                self.tasks_waiting = true;

                self.getLine(function(line) {
                    self.innermost_exec_layer.stack.push(line);
                    self.run_tasks();
                })
            }
        },
        'floor':
        {
            argc: 1,
            exec: function(x)
            {
                if (typeof x !== 'number')
                {
                    self.errorHandler('Error: floor: argument is not a number');
                    return;
                }

                return Math.floor(x);
            }
        },
        'str_to_n':
        {
            argc: 1,
            exec: function(x)
            {
                if (typeof x !== 'string')
                {
                    self.errorHandler('Error: str_to_f: argument is not a string');
                    return;
                }

                return parseFloat(x); // TODO: Be more strict than javascript's permissive parseFloat
            }
        },
        'ignore':
        {
            argc: 1,
            exec: function(x) { }
        },
        '&&':
        {
            argc: 2,
            exec: function(a, b) { return a && b; } // TODO: type checking
        },
        '||':
        {
            argc: 2,
            exec: function(a, b) { return a || b; } // TODO: type checking
        }
    };

    this.module_variables = {};

    this.lp_functions = [];

    this.constants =
    {
        'true': true,
        'false': false
    };

    this.handle_string = function(str)
    {
        for (var i = 0; i != str.length; i++)
        {
            self.comment_layer.handle_char(str[i]);
        }
    }

    this.comment_layer = new (function()
    {
        var layer = this;

        this.next_layer = null;

        this.had_slash = false;
        this.had_star = false;
        this.had_escape = false;

        this.block_depth = 0;
        this.block_has_newline = false;

        this.handle_char = function(c)
        {
            //self.outputHandler('comment layer: \'' + c + '\'');
            layer.mode(c);
        }

        this.normal_mode = function(c)
        {
            if (c === '"')
            {
                layer.had_slash = false;
                layer.mode = layer.string_mode;
                layer.next_layer.handle_char(c);
            }
            else if (layer.had_slash)
            {
                layer.had_slash = false;

                if (c === '/')
                {
                    layer.mode = layer.line_comment_mode;
                }
                else if (c === '*')
                {
                    layer.block_depth = 1;
                    layer.mode = layer.block_comment_mode;
                }
                else
                {
                    layer.next_layer.handle_char('/');
                    layer.next_layer.handle_char(c);
                }
            }
            else
            {
                if (c === '/')
                {
                    layer.had_slash = true;
                }
                else
                {
                    layer.next_layer.handle_char(c);
                }
            }
        }

        this.string_mode = function(c)
        {
            if (layer.had_escape)
            {
                layer.had_escape = false;
            }
            else if (c === '\\')
            {
                layer.had_escape = true;
            }
            else if (c === '"')
            {
                layer.mode = layer.normal_mode;
            }

            layer.next_layer.handle_char(c);
        }

        this.line_comment_mode = function(c)
        {
            if (c === '\n')
            {
                layer.mode = layer.normal_mode;
                layer.next_layer.handle_char('\n');
            }
        }

        this.block_comment_mode = function(c)
        {
            if (layer.had_slash)
            {
                layer.had_slash = false;

                if (c === '*')
                {
                    layer.block_depth++;
                    //self.outputHandler('incremented block depth to ' + layer.block_depth);
                }
                else if (c === '\n')
                {
                    layer.block_has_newline = true;
                }
            }
            else if (layer.had_star)
            {
                layer.had_star = false;

                if (c === '/')
                {
                    layer.block_depth--;
                    //self.outputHandler('decremented block depth to ' + layer.block_depth);

                    if (layer.block_depth === 0)
                    {
                        layer.next_layer.handle_char(layer.block_has_newline ? '\n' : ' ');
                        layer.block_has_newline = false;
                        layer.mode = layer.normal_mode;
                    }
                }
                else if (c === '\n')
                {
                    layer.block_has_newline = true;
                }
            }
            else
            {
                if (c === '/')
                {
                    layer.had_slash = true;
                }
                else if (c === '*')
                {
                    layer.had_star = true;
                }
            }
        }

        this.mode = this.normal_mode;
    })();

    this.word_layer = new (function()
    {
        var layer = this;

        this.next_layer = null;

        this.word = '';

        this.had_escape = false;

        this.handle_char = function(c)
        {
            //self.outputHandler('word layer: \'' + c + '\'');
            if (layer.word.length > 0 && layer.word[0] === '"')
            {
                if (layer.had_escape)
                {
                    layer.had_escape = false;
                    layer.word += c;
                }
                else
                {
                    if (c === '\\')
                    {
                        layer.had_escape = true;
                    }
                    else
                    {
                        layer.word += c;

                        if (c === '"')
                        {
                            layer.next_layer.handle_word(layer.word);
                            layer.word = ''; // TODO: this will allow the next word to start without whitespace, e.g. "foo"7 will be two words
                        }
                    }
                }
            }
            else
            {
                if (c === ' ' || c === '\n' || c === '\t' || c === '\r')
                {
                    if (layer.word !== '')
                    {
                        var words = []; // TODO: The naming is confusing here because layer.word would seem to be ONE word

                        while (true)
                        {
                            if (layer.word[layer.word.length - 1] === ')')
                            {
                                words.unshift(')');
                                layer.word = layer.word.substr(0, layer.word.length - 1);
                            }
                            else if (layer.word.length >= 2 && layer.word.substr(layer.word.length - 2) === ')#')
                            {
                                words.unshift(')#');
                                layer.word = layer.word.substr(0, layer.word.length - 2);
                            }
                            else
                            {
                                if (layer.word !== '')
                                {
                                    words.unshift(layer.word);
                                }

                                break;
                            }
                        }

                        for (var i in words)
                        {
                            if (self.lpf_regex.test(words[i]))
                            {
                                self.errorHandler('Error: Cannot parse word "' + words[i] + '"');
                            }
                            else
                            {
                                layer.next_layer.handle_word(words[i]);
                            }
                        }

                        layer.word = '';
                    }
                }
                else
                {
                    layer.word += c;

                    if (layer.word === '(')
                    {
                        layer.next_layer.handle_word(layer.word);
                        layer.word = '';
                    }
                }
            }
        }
    })();

    this.comment_layer.next_layer = this.word_layer;

    this.number_regex = new RegExp('^[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?$');
    this.module_variable_regex = new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*@$');
    this.variable_regex = new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$');
    this.lpf_regex = new RegExp('lpf:(0|[1-9][0-9]*)(#?)');

    this.function_layer = new (function()
    {
        var layer = this;

        this.next_layer = null;

        this.stack = [];
        this.curr_fn = null;

        this.handle_word = function(word)
        {
            if (word === '(')
            {
                if (layer.curr_fn !== null)
                {
                    layer.stack.push(layer.curr_fn);
                }

                layer.curr_fn =
                {
                    words: [],
                    id: 'lpf:' + self.lp_functions.length
                };

                self.lp_functions.push(layer.curr_fn.words);

                return;
            }

            if (layer.curr_fn === null)
            {
                layer.next_layer.handle_word(word);
                return;
            }

            if (word === ')' || word === ')#')
            {
                var lpf_word = layer.curr_fn.id + (word === ')#' ? '#' : '');

                if (layer.stack.length === 0)
                {
                    layer.next_layer.handle_word(lpf_word);
                    layer.curr_fn = null;
                }
                else
                {
                    layer.curr_fn = layer.stack.pop();
                    layer.curr_fn.words.push(lpf_word);
                }

                return;
            }

            if (word === 'this' || word === 'this#')
            {
                layer.curr_fn.words.push(layer.curr_fn.id + (word === 'this#' ? '#' : ''));
                return;
            }

            layer.curr_fn.words.push(word);
        }
    })();

    this.word_layer.next_layer = this.function_layer;

    this.innermost_exec_layer = null;

    this.tasks = [];
    this.tasks_waiting = false;

    this.add_task = function(t, layer)
    {
        if (!self.tasks_waiting)
        {
            t();
        }
        else
        {
            layer.tasks.push(t);
        }
    }

    this.run_tasks = function()
    {
        self.tasks_waiting = false;

        while (!self.tasks_waiting && self.innermost_exec_layer.tasks.length > 0)
        {
            self.innermost_exec_layer.tasks.shift()();
        }
    }

    this.create_exec_layer = function() { return new (function()
    {
        var layer = this;

        this.parent_layer = self.innermost_exec_layer;
        self.innermost_exec_layer = this;

        this.stack = [];
        this.variables = {};

        this.tasks = [];
        this.add_task = function(task) { self.add_task(task, layer); }

        this.handle_word = function(word) {layer.add_task(function()
        {
            //self.outputHandler('exec layer: handle_word: ' + word);
            var lpf_match = self.lpf_regex.exec(word);

            if (lpf_match !== null)
            {
                var lpf_words = self.lp_functions[parseInt(lpf_match[1])];

                if (lpf_match[2] === '#')
                {
                    layer.stack.push(
                        {
                            type: 'function', // TODO: Couldn't we just do without this structure for everything but variables?
                            value:
                            {
                                argc: 0,
                                exec: function()
                                {
                                    self.innermost_exec_layer.exec_lpf(lpf_words);
                                }
                            }
                        });
                }
                else
                {
                    layer.exec_lpf(lpf_words);
                }
            }
            else if (word[word.length - 1] === '#')
            {
                var sub_word = word.substr(0, word.length - 1);

                if (self.builtin_functions[sub_word])
                {
                    layer.stack.push({type: 'function', value: self.builtin_functions[sub_word]});
                }
                else if (layer.variables[sub_word])
                {
                    layer.stack.push({type: 'variable', name: sub_word});
                }
                else if (self.module_variables[sub_word])
                {
                    layer.stack.push({type: 'module_variable', name: sub_word});
                }
                else
                {
                    self.errorHandler('Error: No matching symbol for "' + sub_word + '"');
                }
            }
            else if (self.builtin_functions[word])
            {
                layer.exec(self.builtin_functions[word]);
            }
            else if (self.constants.hasOwnProperty(word))
            {
                layer.stack.push(self.constants[word]);
            }
            else if (layer.variables[word])
            {
                var variable = layer.variables[word];

                if (typeof variable === 'object')
                {
                    layer.exec(variable);
                }
                else
                {
                    layer.stack.push({type: 'variable', name: word});
                }
            }
            else if (self.module_variables[word])
            {
                var variable = self.module_variables[word];

                if (typeof variable === 'object')
                {
                    layer.exec(variable);
                }
                else
                {
                    layer.stack.push({type: 'module_variable', name: word});
                }
            }
            else if (self.number_regex.test(word))
            {
                layer.stack.push(parseFloat(word));
            }
            else if (word.length >= 2 && word[0] === '"' && word[word.length - 1] === '"')
            {
                layer.stack.push(word.substr(1, word.length - 2));
            }
            else if (self.variable_regex.test(word))
            {
                layer.stack.push({type: 'variable', name: word});
            }
            else if (self.module_variable_regex.test(word))
            {
                layer.stack.push({type: 'module_variable', name: word});
            }
            else
            {
                self.errorHandler('Error: Cannot parse word "' + word + '"');
            }
        })}

        this.exec = function(fn)
        {
            // Check the stack can provide the arguments required
            if (layer.stack.length < fn.argc)
            {
                self.errorHandler('Error: Not enough arguments for function (' + layer.stack.length + ' < ' + fn.argc + ')');
                layer.stack.length = 0;
                return;
            }

            // Retrieve function arguments from the stack
            var args = layer.stack.splice(layer.stack.length - fn.argc, fn.argc);

            var args_error = false;

            // Replace variables with values
            for (var i in args)
            {
                args[i] = layer.strip(args[i]);

                if (args[i] === undefined)
                {
                    args_error = true;
                }
            }

            if (args_error)
            {
                self.errorHandler('Error: Cannot call function due to argument error(s)');
                return;
            }

            // Call the function
            var ret = fn.exec.apply(null, args);

            // Place the return value on the stack if one is provided
            if (ret !== undefined)
            {
                layer.stack.push(ret);
            }
        }

        this.exec_lpf = function(lpf_words)
        {
            var sub_exec_layer = self.create_exec_layer();

            for (var i in lpf_words)
            {
                sub_exec_layer.handle_word(lpf_words[i]);
            }

            sub_exec_layer.add_task(function()
            {
                for (var i in sub_exec_layer.stack)
                {
                    var stripped = sub_exec_layer.strip(sub_exec_layer.stack[i]);

                    if (stripped !== undefined)
                    {
                        layer.stack.push(stripped);
                    }
                }

                self.innermost_exec_layer = layer;
            });
        }

        this.strip = function(x)
        {
            if (typeof x === 'object' && x.type === 'variable')
            {
                var value = layer.variables[x.name];

                if (value === undefined)
                {
                    self.errorHandler('Error: Cannot strip undefined variable ' + x.name);
                    return undefined;
                }

                if (typeof value === 'object')
                {
                    return {type: 'function', value: value};
                }

                return value;
            }
            else if (typeof x === 'object' && x.type === 'module_variable')
            {
                var value = self.module_variables[x.name];

                if (value === undefined)
                {
                    self.errorHandler('Error: Cannot strip undefined variable ' + x.name);
                    return undefined;
                }

                if (typeof value === 'object')
                {
                    return {type: 'function', value: value};
                }

                return value;
            }

            return x;
        }

        this.pull = function(n)
        {
            if (layer.parent_layer === null)
            {
                self.errorHandler('Error: pull: no parent layer to pull from');
                return;
            }

            var pulled_items = layer.parent_layer.stack.splice(layer.parent_layer.stack.length - n, n);

            for (var i in pulled_items)
            {
                var stripped = layer.parent_layer.strip(pulled_items[i]);

                if (stripped !== undefined)
                {
                    layer.stack.push(stripped);
                }
            }
        }
    })()};

    this.exec_layer = this.create_exec_layer();

    this.function_layer.next_layer = this.exec_layer;
}
