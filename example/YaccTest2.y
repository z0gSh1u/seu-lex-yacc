%{

%}

%token a
%start S
%%

S
 : C a
 ;

C
 : a
 ;

%%
#include <stdio.h>

