D			[0-9]
L			[a-zA-Z_]

%{
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define out(fmt, ...) fprintf(yyout, fmt, ##__VA_ARGS__)

#define AUTO 0x01
#define BREAK 0x02
#define CASE 0x03
#define CHAR 0x04
#define CONST 0x05
#define CONTINUE 0x06
#define DEFAULT 0x07
#define DO 0x08
#define DOUBLE 0x09
#define ELSE 0x0a
#define ENUM 0x0b
#define EXTERN 0x0c
#define FLOAT 0x0d
#define FOR 0x0e
#define GOTO 0x0f
#define IF 0x10
#define INLINE 0x11
#define INT 0x12
#define LONG 0x13
#define REGISTER 0x14
#define RESTRICT 0x15
#define RETURN 0x16
#define SHORT 0x17
#define SIGNED 0x18
#define SIZEOF 0x19
#define STATIC 0x1a
#define STRUCT 0x1b
#define SWITCH 0x1c
#define TYPEDEF 0x1d
#define UNION 0x1e
#define UNSIGNED 0x1f
#define VOID 0x20
#define VOLATILE 0x21
#define WHILE 0x22
#define IDENTIFIER 0x23
#define CONSTANT 0x24
// #define CONSTANT 0x25
// #define CONSTANT 0x26
// #define CONSTANT 0x27
#define STRING_LITERAL 0x28
#define ELLIPSIS 0x29
#define RIGHT_ASSIGN 0x2a
#define LEFT_ASSIGN 0x2b
#define ADD_ASSIGN 0x2c
#define SUB_ASSIGN 0x2d
#define MUL_ASSIGN 0x2e
#define DIV_ASSIGN 0x2f
#define MOD_ASSIGN 0x30
#define AND_ASSIGN 0x31
#define XOR_ASSIGN 0x32
#define OR_ASSIGN 0x33
#define RIGHT_OP 0x34
#define LEFT_OP 0x35
#define INC_OP 0x36
#define DEC_OP 0x37
#define PTR_OP 0x38
#define AND_OP 0x39
#define OR_OP 0x3a
#define LE_OP 0x3b
#define GE_OP 0x3c
#define EQ_OP 0x3d
#define NE_OP 0x3e
#define SEMICOLON 0x3f
#define LBRACE 0x40
#define RBRACE 0x41
#define COMMA 0x42
#define COLON 0x43
#define ASSIGN 0x44
#define LPAREN 0x45
#define RPAREN 0x46
#define LBRACKET 0x47
#define RBRACKET 0x48
#define DOT 0x49
#define BITAND_OP 0x4a
#define BITNOT_OP 0x4b
#define BITINV_OP 0x4c
#define MINUS 0x4d
#define PLUS 0x4e
#define MULTIPLY 0x4f
#define SLASH 0x50
#define PERCENT 0x51
#define LT_OP 0x52
#define GT_OP 0x53
#define BITXOR_OP 0x54
#define BITOR_OP 0x55
#define QUESTION 0x56
#define WHITESPACE 0x57
#define UNMATCH 0x58
#define COMMENT 0x59

char TokenName[0x5a][256] = {
    "",
    "AUTO",
    "BREAK",
    "CASE",
    "CHAR",
    "CONST",
    "CONTINUE",
    "DEFAULT",
    "DO",
    "DOUBLE",
    "ELSE",
    "ENUM",
    "EXTERN",
    "FLOAT",
    "FOR",
    "GOTO",
    "IF",
    "INLINE",
    "INT",
    "LONG",
    "REGISTER",
    "RESTRICT",
    "RETURN",
    "SHORT",
    "SIGNED",
    "SIZEOF",
    "STATIC",
    "STRUCT",
    "SWITCH",
    "TYPEDEF",
    "UNION",
    "UNSIGNED",
    "VOID",
    "VOLATILE",
    "WHILE",
    "IDENTIFIER",
    "CONSTANT",
    "CONSTANT",
    "CONSTANT",
    "CONSTANT",
    "STRING_LITERAL",
    "ELLIPSIS",
    "RIGHT_ASSIGN",
    "LEFT_ASSIGN",
    "ADD_ASSIGN",
    "SUB_ASSIGN",
    "MUL_ASSIGN",
    "DIV_ASSIGN",
    "MOD_ASSIGN",
    "AND_ASSIGN",
    "XOR_ASSIGN",
    "OR_ASSIGN",
    "RIGHT_OP",
    "LEFT_OP",
    "INC_OP",
    "DEC_OP",
    "PTR_OP",
    "AND_OP",
    "OR_OP",
    "LE_OP",
    "GE_OP",
    "EQ_OP",
    "NE_OP",
    "SEMICOLON",
    "LBRACE",
    "RBRACE",
    "COMMA",
    "COLON",
    "ASSIGN",
    "LPAREN",
    "RPAREN",
    "LBRACKET",
    "RBRACKET",
    "DOT",
    "BITAND_OP",
    "BITNOT_OP",
    "BITINV_OP",
    "MINUS",
    "PLUS",
    "MULTIPLY",
    "SLASH",
    "PERCENT",
    "LT_OP",
    "GT_OP",
    "BITXOR_OP",
    "BITOR_OP",
    "QUESTION",
    "WHITESPACE",
    "UNMATCH",
    "COMMENT"
};

%}

%%
"//"(.*)(\n)?  { return(COMMENT); }
"auto"			{ return(AUTO); }
"break"			{ return(BREAK); }
"case"			{ return(CASE); }
"char"			{ return(CHAR); }
"const"			{ return(CONST); }
"continue"	{ return(CONTINUE); }
"default"		{ return(DEFAULT); }
"do"			  { return(DO); }
"double"		{ return(DOUBLE); }
"else"			{ return(ELSE); }
"enum"			{ return(ENUM); }
"extern"		{ return(EXTERN); }
"float"			{ return(FLOAT); }
"for"			  { return(FOR); }
"goto"			{ return(GOTO); }
"if"			  { return(IF); }
"inline"		{ return(INLINE); }
"int"			  { return(INT); }
"long"			{ return(LONG); }
"register"	{ return(REGISTER); }
"restrict"	{ return(RESTRICT); }
"return"		{ return(RETURN); }
"short"			{ return(SHORT); }
"signed"		{ return(SIGNED); }
"sizeof"		{ return(SIZEOF); }
"static"		{ return(STATIC); }
"struct"		{ return(STRUCT); }
"switch"		{ return(SWITCH); }
"typedef"		{ return(TYPEDEF); }
"union"			{ return(UNION); }
"unsigned"	{ return(UNSIGNED); }
"void"			{ return(VOID); }
"volatile"	{ return(VOLATILE); }
"while"			{ return(WHILE); }
{L}         { return(IDENTIFIER); }
{L}({L}|{D})*		{ return(IDENTIFIER); }
[1-9]{D}*						{ return(CONSTANT); }
{D}+								{ return(CONSTANT); }
{D}*"."{D}*					{ return(CONSTANT); }
{D}+"."{D}*					{ return(CONSTANT); }
\"[^"\n]*\" { return (STRING_LITERAL); }
"..."			{ return(ELLIPSIS); }
">>="			{ return(RIGHT_ASSIGN); }
"<<="			{ return(LEFT_ASSIGN); }
"+="			{ return(ADD_ASSIGN); }
"-="			{ return(SUB_ASSIGN); }
"*="			{ return(MUL_ASSIGN); }
"/="			{ return(DIV_ASSIGN); }
"%="			{ return(MOD_ASSIGN); }
"&="			{ return(AND_ASSIGN); }
"^="			{ return(XOR_ASSIGN); }
"|="			{ return(OR_ASSIGN); }
">>"			{ return(RIGHT_OP); }
"<<"			{ return(LEFT_OP); }
"++"			{ return(INC_OP); }
"--"			{ return(DEC_OP); }
"->"			{ return(PTR_OP); }
"&&"			{ return(AND_OP); }
"||"			{ return(OR_OP); }
"<="			{ return(LE_OP); }
">="			{ return(GE_OP); }
"=="			{ return(EQ_OP); }
"!="			{ return(NE_OP); }
";"				{ return(SEMICOLON); }
"{"	    	{ return(LBRACE); }
"}"	  		{ return(RBRACE); }
","				{ return(COMMA); }
":"				{ return(COLON); }
"="				{ return(ASSIGN); }
"(" 			{ return(LPAREN); }
")"				{ return(RPAREN); }
"["			  { return(LBRACKET); }
"]"	  		{ return(RBRACKET); }
"."				{ return(DOT); }
"&"				{ return(BITAND_OP); }
"!"				{ return(BITNOT_OP); }
"~"				{ return(BITINV_OP); }
"-"				{ return(MINUS); }
"+"				{ return(PLUS); }
"*"				{ return(MULTIPLY); }
"/"				{ return(SLASH); }
"%"				{ return(PERCENT); }
"<"				{ return(LT_OP); }
">"				{ return(GT_OP); }
"^"				{ return(BITXOR_OP); }
"|"				{ return(BITOR_OP); }
"?"				{ return(QUESTION); }
[ \n\r\t] { return (WHITESPACE);}
.			 	 	{ return(UNMATCH); }

%%

int main(int argc, char** argv) {
  // redirect yyin
  yyin = fopen(argv[1], "r");
	// redirect yyout if you want, or stdout by default
	// yyout = stdout;
	int c;
	// keep calling yylex
  while (c = yylex()) {
    //if (c == (WHITESPACE)) continue;
    out("Token: %15s  ||  yytext: %15s\n", TokenName[c], yytext);
    // ECHO; // printf yytext
  }
  fclose(yyin);
  return 0;
}

int yywrap() {
  return 1;
}