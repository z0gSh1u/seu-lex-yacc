node ..\..\dist\seulex\cli.js .\Lex.l
node ..\..\dist\seuyacc\cli.js .\Yacc.y
gcc yy.seuyacc.c yy.seulex.c -o yy.ok.exe
./yy.ok.exe C.in
