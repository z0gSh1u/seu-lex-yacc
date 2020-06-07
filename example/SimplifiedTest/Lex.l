D			[0-9]
L			[a-zA-Z_]

%{
  #include "yy.tab.h"
%}

%%
"float"			{ return(FLOAT); }
"if"			  { return(IF); }
"int"			  { return(INT); }
"return"		{ return(RETURN); }
"void"			{ return(VOID); }
"while"     { return(WHILE); }
"true"     { return(TRUE); }
"false"     { return(FALSE); }
{L}         { return(IDENTIFIER); }
{L}({L}|{D})*		{ return(IDENTIFIER); }
[1-9]{D}*						{ return(CONSTANT); }
{D}+								{ return(CONSTANT); }
{D}*"."{D}*					{ return(CONSTANT); }
{D}+"."{D}*					{ return(CONSTANT); }
\"[^"\n]*\" { return (STRING_LITERAL); }
"+="			{ return(ADD_ASSIGN); }
"&&"			{ return(AND_OP); }
"||"			{ return(OR_OP); }
"=="			{ return(EQ_OP); }
"!="			{ return(NE_OP); }
"++"			{ return(INC_OP); }
";"				{ return(SEMICOLON); }
"{"	    	{ return(LBRACE); }
"}"	  		{ return(RBRACE); }
","				{ return(COMMA); }
"="				{ return(ASSIGN); }
"(" 			{ return(LPAREN); }
")"				{ return(RPAREN); }
[ \n\r\t]  { return (WHITESPACE); }
.         { return (WHITESPACE); }

%%