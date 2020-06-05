%{

%}
D			[0-9]
%%

"#"			return (SHARP);
"-"			return (MINUS);
"+"			return (PLUS);
"*"			return (MULTIPLY);
"/"			return (DIVIDE);
"("			return (LPAREN);
")"			return (RPAREN);
{D}+		{ /* yytext will be number itself in string. */ return (NUMBER); }
\s			;
.			  return (UNKNOWN);

%%