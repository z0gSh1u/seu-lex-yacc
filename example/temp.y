%{
#include <nothing>
%}
%left '+' '-'
%token ZHUOLAO TQL
%right '='
%token YYY
%left '*' '/'

%start kaishi

%%
kaishi
    : kaishi YYY
    | ZHUOLAO '=' TQL {true;}
    | ZHUOLAO 'i' 's' TQL {if (true) {$$ = "}\"";}}
    ;

zhongjian
    : kaishi {}
    | zhongjian TQL ZHUOLAO 
    ;

jieshu
    : zhongjian YYY {reuturn 0;}
    ;

%%
#include <stdio.h>

extern char yytext[];
extern int column;

void yyerror(char const *s)
{
	fflush(stdout);
	printf("\n%*s\n%*s\n", column, "^", column, s);
}
