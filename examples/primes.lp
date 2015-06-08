is_prime@
(
    n 1 pull =

    2 n
    (
        n 1 pull =
        i 1 pull =
        
        finished i i * n > =
        
        finished n 1 > &&
        i 1 + n this#
        (
            3 pull ignore ignore ignore
            1 pull
        )#
        (
            3 pull
            1 pull ignore
            exec
        )#
        n i % 0 == finished ||
        if_else
    )
)# =

loop@
(
    // Pull in parameters from parent stack
    fn 1 pull =
    limit 1 pull =
    i 1 pull =
    
    // Prepared call to next iteration
    i 1 + limit fn# this#
    
    // Prepared call to external function
    i fn#
    
    // Conditional execution of prepared calls
    (6 pull exec exec)#
    
    // Execute if i <= limit
    i limit <= if
)# =

print_if_prime
(
    n 1 pull =
    
    n
    print#
    ignore#
    n is_prime@
    if_else
)# =

1 300 print_if_prime# loop@
