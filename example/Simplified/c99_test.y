%{
	// nothing
%}

%token IDENTIFIER CONSTANT STRING_LITERAL
%token INC_OP LE_OP EQ_OP NE_OP GT_OP LT_OP
%token AND_OP OR_OP ADD_ASSIGN
%token INT VOID TRUE FALSE
%token IF CONTINUE BREAK RETURN

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
  : type IDENTIFIER ';'
	| type assign_expr ';'
	;

func_declaration
  : type IDENTIFIER '(' parameter_list ')' block_stmt
	| type IDENTIFIER '(' ')' block_stmt
	;

parameter_list
  : type IDENTIFIER ',' parameter_list
	| type IDENTIFIER
	;

stmt
  : IF '(' logic_expr ')' stmt
	| IF '(' logic_expr ')' stmt ELSE stmt
	| WHILE '(' logic_expr ')' stmt
	| var_declaration
	| assign_expr ';'
	| function_call ';'
	| RETURN arithmetic_expr ';'
	| block_stmt
	;

stmts
  : stmt stmts
	| stmt
	;

block_stmt		
  : '{' stmts '}'
	;

type		
  : 'int'
	| 'char'
	| 'bool'
	| 'float'
	| 'double'
	| 'void'
	;

expr
	: assign_expr
	| arithmetic_expr
	| logic_expr
	;

assign_expr
	: IDENTIFIER '=' expr
	| IDENTIFIER ADD_ASSIGN expr
	;

arithmetic_expr	
  : arithmetic_expr '+' arithmetic_expr
	| arithmetic_expr '-' arithmetic_expr
	| arithmetic_expr '*' arithmetic_expr
	| arithmetic_expr '/' arithmetic_expr
	| '(' arithmetic_expr ')'
	| IDENTIFIER
	| NUMBER
	| function_call
	;

logic_expr	
	: logic_expr AND_OP logic_expr
	| logic_expr OR_OP logic_expr
	| '!' logic_expr
	| '(' logic_expr ')'
	| arithmetic_expr EQ_OP arithmetic_expr
	| arithmetic_expr NE_OP arithmetic_expr
	| arithmetic_expr GT_OP arithmetic_expr
	| arithmetic_expr LT_OP arithmetic_expr
	| TRUE
	| FALSE
	;

function_call
  : IDENTIFIER '(' argument_list ')'
	| IDENTIFIER '(' ')'		
	;

argument_list
  : arithmetic_expr ',' argument_list
	| arithmetic_expr
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
