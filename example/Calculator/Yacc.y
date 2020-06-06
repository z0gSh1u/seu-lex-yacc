%{
	#include <stdlib.h>
	#define out(fmt, ...) fprintf(yyout, fmt, ##__VA_ARGS__)
%}

%token SHARP MINUS PLUS MULTIPLY DIVIDE LPAREN RPAREN NUMBER UNKNOWN
%left PLUS MINUS
%left MULTIPLY DIVIDE
%start expr

%%

expr
  : expr PLUS expr	{ out("%s", "r(expr+expr)"); itoa(atoi($1) + atoi($3), $$, 10); }
	| expr MINUS expr	{ out("%s", "r(expr-expr)"); itoa(atoi($1) - atoi($3), $$, 10); }
	| expr MULTIPLY expr	{ out("%s", "r(expr*expr)"); itoa(atoi($1) * atoi($3), $$, 10); }
	| expr DIVIDE expr	{ out("%s", "r(expr/expr)"); itoa(atoi($1) / atoi($3), $$, 10); }
	| LPAREN expr ')'
	| NUMBER  { $$ = $1; /* default operation in fact */ }
	;

%%

int main(int argc, char** argv) {
  // redirect yyin
  yyin = fopen(argv[1], "r");
	// redirect yyout if you want, or stdout by default
	// yyout = stdout;
	int c;
	// keep calling yyparse
  c = yyparse();
	if (c == 0) printf("result is %d", atoi(yytext));
	else printf("oh no!");
  fclose(yyin);
  return 0;
}

int yywrap() {
  return 1;
}