"=========== Guess-A-Number ===========" print
"" print
"I'm thinking of a number from 1 to 100" print

// Generate a random number from 1 to 100
n rand 100 * floor 1 + =

n
(
    // Bring n into the current scope
    n 1 pull =
    
    "" print
    "Enter your guess:" print
    guess readline str_to_n = // Read in the guess
    
    guess n this# // Arguments to the two branches
    (
        // Runs when {guess n ==} is true
        3 pull ignore ignore ignore
        "You win!" print
    )#
    (
        // Runs when {guess n ==} is false

        // Pull the arguments into this scope
        retry 1 pull =
        n 1 pull =
        guess 1 pull =
        
        // Print lower or higher accordingly
        ("Lower" print)#
        ("Higher" print)#
        n guess <
        if_else
        
        // Retry
        n retry
    )#
    guess n == // Was the guess equal to the random number n?
    if_else
)
