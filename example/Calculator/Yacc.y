%{
	#include <stdlib.h>
	#define out(fmt, ...) fprintf(yyout, fmt, ##__VA_ARGS__)
%}

%token SHARP MINUS PLUS MULTIPLY DIVIDE NUMBER UNKNOWN
%left PLUS MINUS
%left MULTIPLY DIVIDE
%start expr

%%

expr
  : expr PLUS expr	{ out("%s\n", "r(expr+expr)"); itoa(atoi($1) + atoi($3), $$, 10); printf("%s,%s,%s\n", $$, $1, $3); }
	| expr MINUS expr	{ out("%s\n", "r(expr-expr)"); itoa(atoi($1) - atoi($3), $$, 10); printf("%s,%s,%s\n",  $$, $1, $3); }
	| expr MULTIPLY expr	{ out("%s\n", "r(expr*expr)"); itoa(atoi($1) * atoi($3), $$, 10); printf("%s,%s,%s\n",  $$, $1, $3); }
	| expr DIVIDE expr	{ out("%s\n", "r(expr/expr)"); itoa(atoi($1) / atoi($3), $$, 10); printf("%s,%s,%s\n",  $$, $1, $3); }
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
	if (c == 0) printf("Result is %d", atoi(yytext));
	else printf("Oh no!");
  fclose(yyin);
  return 0;
}

int yywrap() {
  return 1;
}