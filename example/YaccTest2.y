%{

%}

%token aa bb cc dd


%start SS
%%

SS
  : CC aa
  ;

CC
  : bb
  ;


%%
#include <stdio.h>

