%{
	#define out(...) fprintf(yyout, "%s\n", ##__VA_ARGS__)
%}

%token IDENTIFIER CONSTANT STRING_LITERAL
%token INC_OP EQ_OP NE_OP ASSIGN PLUS MULTIPLY
%token AND_OP OR_OP ADD_ASSIGN LBRACE RBRACE
%token INT FLOAT VOID TRUE FALSE SEMICOLON COMMA LPAREN RPAREN
%token IF RETURN ELSE WHILE WHITESPACE

%start program
%%

program
  : declarations { out("Reduce@program->declarations"); }
	;

declarations
  : declaration declarations { out("Reduce@declarations->declaration declarations"); }
	| declaration { out("Reduce@declarations->declaration"); }
	;

declaration
  : func_declaration { out("Reduce@declaration->func_declaration"); }
	| var_declaration { out("Reduce@declaration->var_declaration"); }
	;

var_declaration
  : type IDENTIFIER SEMICOLON { out("Reduce@var_declaration->type IDENTIFIER SEMICOLON"); }
	| type assign_expr SEMICOLON { out("Reduce@var_declaration->type assign_expr SEMICOLON"); }
	;

func_declaration
  : type IDENTIFIER LPAREN parameter_list RPAREN block_stmt { out("Reduce@func_declaration->type IDENTIFIER LPAREN parameter_list RPAREN block_stmt"); }
	| type IDENTIFIER LPAREN RPAREN block_stmt { out("Reduce@func_declaration->type IDENTIFIER LPAREN RPAREN block_stmt"); }
	;

parameter_list
  : type IDENTIFIER ',' parameter_list { out("Reduce@declaration->var_declaration"); }
	| type IDENTIFIER { out("Reduce@declaration->var_declaration"); }
	;

stmt
  : IF LPAREN logic_expr RPAREN stmt { out("Reduce@stmt->IF LPAREN logic_expr RPAREN stmt"); }
	| IF LPAREN logic_expr RPAREN stmt ELSE stmt { out("Reduce@stmt->IF LPAREN logic_expr RPAREN stmt ELSE stmt"); }
	| WHILE LPAREN logic_expr RPAREN stmt { out("Reduce@stmt->WHILE LPAREN logic_expr RPAREN stmt"); }
	| var_declaration { out("Reduce@stmt->var_declaration"); }
	| assign_expr SEMICOLON { out("Reduce@stmt->assign_expr SEMICOLON"); }
	| function_call SEMICOLON { out("Reduce@stmt->function_call SEMICOLON"); }
	| RETURN arithmetic_expr SEMICOLON { out("Reduce@stmt->RETURN arithmetic_expr SEMICOLON"); }
	| block_stmt { out("Reduce@stmt->block_stmt"); }
	;

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

stmts
  : stmt stmts { out("Reduce@stmt->block_stmt"); }
	| stmt { out("Reduce@stmt->block_stmt"); }
	;

block_stmt
  : LBRACE stmts RBRACE { out("Reduce@stmt->block_stmt"); }
  | LBRACE RBRACE { out("Reduce@stmt->block_stmt"); }
	;

type
  : INT { out("Reduce@stmt->block_stmt"); }
	| FLOAT { out("Reduce@stmt->block_stmt"); }
	;

expr
	: assign_expr { out("Reduce@stmt->block_stmt"); }
	| arithmetic_expr { out("Reduce@stmt->block_stmt"); }
	| logic_expr { out("Reduce@stmt->block_stmt"); }
	;

assign_expr
	: IDENTIFIER ASSIGN arithmetic_expr { out("Reduce@stmt->block_stmt"); }
	| IDENTIFIER ADD_ASSIGN arithmetic_expr { out("Reduce@stmt->block_stmt"); }
	;

arithmetic_expr
  : arithmetic_expr PLUS arithmetic_expr { out("Reduce@arithmetic_expr->block_stmt"); }
	| arithmetic_expr MULTIPLY arithmetic_expr { out("Reduce@arithmetic_expr->block_stmt"); }
	| LPAREN arithmetic_expr RPAREN { out("Reduce@arithmetic_expr->block_stmt"); }
	| IDENTIFIER { out("Reduce@arithmetic_expr->block_stmt"); }
	| CONSTANT { out("Reduce@arithmetic_expr->block_stmt"); }
	| function_call { out("Reduce@arithmetic_expr->block_stmt"); }
	;

logic_expr
	: logic_expr AND_OP logic_expr { out("Reduce@logic_expr->logic_expr AND_OP logic_expr"); }
	| logic_expr OR_OP logic_expr { out("Reduce@logic_expr->logic_expr OR_OP logic_expr"); }
	| LPAREN logic_expr RPAREN { out("Reduce@logic_expr->LPAREN logic_expr RPAREN"); }
	| arithmetic_expr EQ_OP arithmetic_expr { out("Reduce@logic_expr->arithmetic_expr EQ_OP arithmetic_expr"); }
	| arithmetic_expr NE_OP arithmetic_expr { out("Reduce@logic_expr->arithmetic_expr NE_OP arithmetic_expr"); }
	| TRUE { out("Reduce@logic_expr->TRUE"); }
	| FALSE { out("Reduce@logic_expr->FALSE"); }
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