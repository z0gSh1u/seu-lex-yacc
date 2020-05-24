node ../dist/seulex/cli.js ./c99_test.l
gcc yy.seulex.c -o yy.seulex.exe  
yy.seulex.exe c99_test.c