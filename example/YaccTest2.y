%{

%}

%token c d e
%start NS
%%

NS
  : S
  ;

S
  : C C
  ;

C
  : c C
  | d e
  ;


%%
#include <stdio.h>

