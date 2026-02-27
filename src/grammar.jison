/* Lexer */
%lex
integer \d+
float {integer}[.]{integer}?
exponent [Ee][+-]?{integer}
%%
\s+                                 { /* skip whitespace */;        }
[/][*](.*\n?)*[*][/]                { /* skip multiline comments*/; } 
[/][/].*                            { /* skip oneline comments*/;   } 
{float}{exponent}?                  { return 'NUMBER';              }
{integer}                           { return 'NUMBER';              }
"**"                                { return 'OP';                  }
[-+*/]                              { return 'OP';                  }
<<EOF>>                             { return 'EOF';                 }
.                                   { return 'INVALID';             }
/lex

/* Parser */
%start expressions
%token NUMBER
%%

expressions
    : expression EOF
        { return $expression; }
    ;

expression
    : expression OP term
        { $$ = operate($OP, $expression, $term); }
    | term
        { $$ = $term; }
    ;

term
    : NUMBER
        { $$ = Number(yytext); }
    ;
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
