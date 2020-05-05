const beautify = require('./beautify').Beautification
const Code = `


int main()
{
int a;    
if(b){return c; } 

for(;t=8;s++){
      x=8;y=9;
      for(i=0;i<z;i++){}
                   }
}
`
console.log(beautify(Code))