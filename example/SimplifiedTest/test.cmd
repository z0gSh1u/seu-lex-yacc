node ..\..\dist\seulex\cli.js .\Lex.l
node ..\..\dist\seuyacc\cli.js .\Yacc.y
gcc yy.seuyacc.c yy.seulex.c -o yy.ok.exe
<<<<<<< HEAD
./yy.ok.exe C.in
=======
yy.ok.exe C.in
>>>>>>> b66641d57d7416e3c4b05f5a0c767b9ebc7f87fc
