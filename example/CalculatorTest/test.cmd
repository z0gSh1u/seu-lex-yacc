node ..\..\dist\seulex\cli.js ..\Calculator\Lex.l
node ..\..\dist\seuyacc\cli.js ..\Calculator\Yacc.y
gcc yy.seuyacc.c yy.seulex.c -o yy.ok.exe
yy.ok.exe Calculator.in