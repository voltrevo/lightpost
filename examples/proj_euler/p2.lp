0 0 1
(
    f2 1 pull =
    f1 1 pull =
    s 1 pull =
    f3 f1 f2 + =
    
    s
    s f3
    (2 pull +)#
    (1 pull ignore 1 pull)#
    f3 2 % 0 == f3 4000000 <= &&
    if_else
    =
    
    s f2 f3
    this#
    f3 4000000 <
    if
)
ignore ignore print
