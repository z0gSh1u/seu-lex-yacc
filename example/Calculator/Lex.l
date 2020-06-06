%{
  #include "yy.tab.h"
%}
D			[0-9]
%%

"-"			return (MINUS);
"+"			return (PLUS);
"*"			return (MULTIPLY);
"/"			return (DIVIDE);
{D}+		{ /* yytext will be number itself in string. */ return (NUMBER); }
\s			;
.			  return (UNKNOWN);

%%