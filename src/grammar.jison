/* Lexer */
%lex
integer \d+
float {integer}[.]{integer}?
exponent [Ee][+-]?{integer}
add [+-]
mul [*/]
pow "**"
line .*\n?
%%
\s+                                 { /* skip whitespace */;        }
[/][*]{line}*[*][/]                 { /* skip multiline comments*/; } 
[/][/].*                            { /* skip oneline comments*/;   } 
[(]                                 { return 'LPAR';                }
[)]                                 { return 'RPAR';                }  
{float}{exponent}?                  { return 'NUMBER';              }
{integer}                           { return 'NUMBER';              }
{pow}                               { return 'POW';                 }
{mul}                               { return 'MUL';                 }
{add}                               { return 'ADD';                 }
<<EOF>>                             { return 'EOF';                 }
.                                   { return 'INVALID';             }
/lex

/* Parser */
%start L
%token LPAR
%token RPAR
%token NUMBER
%%

L: E EOF { return $E; };

E: E ADD T { $$ = operate($ADD, $E, $T); }
   | T { $$ = $T; };

T: T MUL R { $$ = operate($MUL, $T, $R); }  
  | R { $$ = $R };

R: F POW R { $$ = operate($POW, $F, $R); }
  | F { $$ = $F; };

F: LPAR E RPAR { $$ = $E; }
  | NUMBER { $$ = Number(yytext); };

%%

function operate(op, left, right) {
  switch (op) {
    case '+': return left + right;
    case '-': return left - right;
    case '*': return left * right;
    case '/': return left / right;
    case '**': return Math.pow(left, right);
  }
}
