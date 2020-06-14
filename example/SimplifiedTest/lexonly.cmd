node ..\..\dist\seulex\cli.js .\LexOnly.l
gcc yy.seulex.c -o yy.seulex.exe
yy.seulex.exe C.in