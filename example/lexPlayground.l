%{
%}
D			[0-9]
L			[a-zA-Z_]
%%

{L}({L}|{D})*		{ return(IDENTIFIER);}

%%
