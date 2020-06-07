%{
	// nothing
%}

%token IDENTIFIER CONSTANT STRING_LITERAL
%token INC_OP EQ_OP NE_OP ASSIGN PLUS MULTIPLY
%token AND_OP OR_OP ADD_ASSIGN LBRACE RBRACE
%token INT FLOAT VOID TRUE FALSE SEMICOLON COMMA LPAREN RPAREN
%token IF RETURN ELSE WHILE WHITESPACE

%start program
%%

program
  : declarations
	;

declarations
  : declaration declarations
	| declaration
	;

declaration
  : func_declaration
	| var_declaration
	;

var_declaration
  : type IDENTIFIER SEMICOLON 
	| type assign_expr SEMICOLON
	;

func_declaration
  : type IDENTIFIER LPAREN parameter_list RPAREN block_stmt
	| type IDENTIFIER LPAREN RPAREN block_stmt
	;

parameter_list
  : type IDENTIFIER ',' parameter_list
	| type IDENTIFIER
	;

stmt
  : IF LPAREN logic_expr RPAREN stmt
	| IF LPAREN logic_expr RPAREN stmt ELSE stmt
	| WHILE LPAREN logic_expr RPAREN stmt
	| var_declaration
	| assign_expr SEMICOLON
	| function_call SEMICOLON
	| RETURN arithmetic_expr SEMICOLON
	| block_stmt
	;

stmts
  : stmt stmts
	| stmt
	;

block_stmt
  : LBRACE stmts RBRACE
  | LBRACE RBRACE
	;

type
  : INT
	| FLOAT
	;

expr
	: assign_expr
	| arithmetic_expr
	| logic_expr
	;

assign_expr
	: IDENTIFIER ASSIGN arithmetic_expr 
	| IDENTIFIER ADD_ASSIGN arithmetic_expr
	;

arithmetic_expr
  : arithmetic_expr PLUS arithmetic_expr
	| arithmetic_expr MULTIPLY arithmetic_expr
	| LPAREN arithmetic_expr RPAREN
	| IDENTIFIER
	| CONSTANT
	| function_call
	;

logic_expr
	: logic_expr AND_OP logic_expr
	| logic_expr OR_OP logic_expr
	| '!' logic_expr
	| LPAREN logic_expr RPAREN
	| arithmetic_expr EQ_OP arithmetic_expr
	| arithmetic_expr NE_OP arithmetic_expr
	| TRUE
	| FALSE
	;

function_call
  : IDENTIFIER LPAREN argument_list RPAREN
	| IDENTIFIER LPAREN RPAREN
	;

argument_list
  : arithmetic_expr ',' argument_list
	| arithmetic_expr
	;

%%
#include <stdio.h>

int main(int argc, char** argv) {
  // redirect yyin
  yyin = fopen(argv[1], "r");
	// redirect yyout if you want, or stdout by default
	// yyout = stdout;
	int c;
	// keep calling yyparse
  c = yyparse();
	if (c == 0) printf("Result is %s", yytext);
	else printf("Oh no!");
  fclose(yyin);
  return 0;
}

int yywrap() {
  return 1;
}