%{
  #include <stdio.h>
  #include <string.h>

  #define out(fmt, ...) fprintf(yyout, fmt, ##__VA_ARGS__)

  #define TITLE 0x01
  #define BOLD 0x02
  #define ITALIC 0x03

  #define YYSTYPE char*
  YYSTYPE yylval;
%}

letter [a-b]
title #{letter}+

%%

{title} { 
  yylval = strdup(yytext + 2); return (TITLE); 
}
a+b? {
  return 0;
}

%%

void writeOut(int c) {
  switch(c) {
    case TITLE: out("(TITLE, \"%s\")", yylval); break;
    case BOLD: out("(BOLD, \"%s\")", yylval); break;
    case ITALIC: out("(ITALIC, \"%s\")", yylval); break;
    default: out("(UNKNOWN)");
  }
  return;
}

int main_test(int argc, char** argv) {
  int c;
  yyin = fopen(argv[1], "r");
  while (c = yylex()) {
    writeOut(c);
  }
  fclose(yyin);
  return 0;
}