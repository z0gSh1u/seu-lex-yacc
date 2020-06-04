%{

%}

%token a
%start S
%%

S
  : '(' L ')'
  | a
  ;

L
  : L ',' S
  | S
  ;


%%
#include <stdio.h>

