"Hello World!" print

1 2 +

x 1 = y 2 = x y +

1 2 +# exec

(1 2 + print)# rand 0.5 < if

1 (x 1 pull = x print x 1 + this# x 100 < if)
1 (this# 1 pull dup print 1 + dup <= 100 if)

swap (1 pull 1 pull)# =

loop
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
    
    // Execute if i < limit
    i limit < if
)# =

1 100 (1 pull print)# loop // Prints 1..100

/* Block comments within block comments /* like this one */ are allowed! */

"Please enter your name:" print
name readline =
"Hi " name ", nice to meet you." + + print
