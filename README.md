# Informe Práctico #4 - Traducción dirigida por la sintaxis
**Asignatura:** *Procesadores de Lenguajes* de [La Escuela Superior de Ingeniería y Tecnología](https://www.ull.es/centros/escuela-superior-de-ingenieria-y-tecnologia/) del **Grado en Ingeniería Informática.**
**Autor:** Adrián Hernández Herrera.
**Fecha:** 26/02/2026

## Introducción
En esta práctica [[vease el enunciado]](docs/README.md) profundizaremos en la utilización de la herramienta `jison` implementando (parcialmente) una calculadora. Partimos desde un inicio con:

### Análisis léxico
La implementación de una **gramática** muy simple para reconocer operaciones:
```Bash
L → E
E → E op T | T  # OP     -> token
T → number      # Number -> token
```
Con las siguientes **definiciones regulares**:
```bash
digit   →    [0-9]
number  →   digit+
op      →   + | - | * | / | **
```

### Análisis sintáctico
La definición del cálculo de la expresión a través de la siguiente **definición dirigida por la sintaxis** ([Syntax Directed Definition - sdd](https://www.geeksforgeeks.org/compiler-design/compiler-design-syntax-directed-definition/)):
| Producción  | Regla semántica                                   |
| ----------- | ------------------------------------------------- |
| L → E eof   | L.value = E.value                                 |
| E → E1 op T | E.value = operate(op.lexvalue, E1.value, T.value) |
| E → T       | E.value = T.value                                 |
| T → number  | T.value = convert(number.lexvalue)                |

\*\* Cada símbolo gramatical posee un atributo _**value**_ \*\*

## Desarrollo
A partir de la implementación del fichero `grammar.jison` con toda la información expuesta anteriormente se desarrollan los siguientes apartados:
1. **Cuestiones**
    - Describa la diferencia entre ```/* skip whitespace */``` y devolver un **token**.
    - Escriba la secuencia exacta de tokens producidos para la entrada 123**45+@.
    - Indique por qué ** debe aparecer antes que [-+*/].
    - Explique cuándo se devuelve EOF.
    - Explique por qué existe la regla . que devuelve INVALID.
2. **Modificación del analizador léxico**
    - Modifique el analizador léxico de grammar.jison para que se salte los comentarios de una línea
que empiezan por //.
    - Modifique el analizador léxico de grammar.jison para que reconozca números en punto flotante
3. **Adición de pruebas en `jest`**

### 1. Cuestiones
#### 1.1 Diferencia entre `/* skip whitespace */` y devolver un **token**
Cuando el analizador léxico encuentra espacios en blanco (\s+) y ejecuta
`/* skip whitespace */ ` simplemente ignora el lexema y continúa analizando la entrada sin generar ningún token.

En cambio, cuando se ejecuta `return 'TOKEN';` el lexer genera un token que será procesado por el parser.
En resumen:

**Skip whitespace** → no influye en el análisis sintáctico.

**Return token** → sí participa en la construcción del árbol sintáctico.

#### 1.2 Secuencia de tokens para 123**45+@
**Entrada:**
```
123**45+@
```
**Secuencia generada:**
```
NUMBER("123")
OP("**")
NUMBER("45")
OP("+")
INVALID("@")
EOF
```
#### 1.3 ¿Por qué ** debe aparecer antes que [-+*/]?

El analizador léxico, en cáso de coincidencia, prioriza el orden de aparición, por lo que si la regla [-+*/] estuviera antes que "**", la cadena:
```
**
```
se tokenizaría como:
```
OP("*")
OP("*")
```
en lugar de:
```
OP("**")
```
Por ello, los patrones más específicos deben declararse antes que los más generales.

#### 1.4 ¿Cuándo se devuelve EOF?

El token `EOF` se devuelve cuando el analizador léxico alcanza el final de la entrada. Este token indica al parser que no existen más símbolos por analizar y permite completar la producción:
```
L → E eof
```
#### 1.5 ¿Por qué existe la regla `.` que devuelve `INVALID`?

La regla `. { return 'INVALID'; }` captura cualquier carácter que no haya sido reconocido por reglas anteriores. Su función es detectar **errores léxicos**, evitando que caracteres inesperados pasen inavertidos (además de evitar comportamientos erráticos).

### 2. Modificación del analizador léxico

#### 2.1 Ignorar comentarios `//`

Se añade una nueva regla:
```
\/\/.*    { /* skip comment */; }
```

De esta manera, cualquier texto desde // hasta el final de línea es ignorado por el lexer.

#### 2.2 Soporte para números en punto flotante

Se modifica la expresión regular de **NUMBER** para soportar:
```
23
2.35
2.35e-3
2.35e+3
2.35E-3
```
Nueva expresión regular:
```
[0-9]+\.[0-9]+[Ee]\-?[0-9]+  { return 'NUMBER'; } // Float in scientific notation
[0-9]+\.[0-9]*               { return 'NUMBER'; } // Float 
```

Lexer final modificado:
```
%lex
%%
\s+                               { /* skip whitespace */;      }
\/\/.*                            { /* skip oneline comments*/; }  
[0-9]+\.[0-9]+[Ee]\-?[0-9]+       { return 'NUMBER';            } 
[0-9]+\.[0-9]*                    { return 'NUMBER';            }
[0-9]+                            { return 'NUMBER';            }
"**"                              { return 'OP';                }
[-+*/]                            { return 'OP';                }
<<EOF>>                           { return 'EOF';               }
.                                 { return 'INVALID';           }
/lex
```
Con esta modificación se permite el reconocimiento de **enteros** y **números decimales** (punto fijo o notación científica).

### 3. Adición de pruebas con `jest`

Para verificar el correcto funcionamiento del lexer y parser se añadieron pruebas en parser.test.js.

**Ejemplos:**
```javascript
  describe('Comment tests', () => {
    test('should handle expressions with oneline comments', () =>{
      expect(parse("1 - 2 // This is a comment")).toBe(-1);
      ... // Más tests aquí
    });
  });

  describe('Float test', () => {
    test('should handle expressions with floats', () => { 
      expect(parse("2.3")).toBe(2.3);
      expect(parse("1.3 + 1.7")).toBe(3.0);
      ... // Más tests aquí
    }); 
    
    test('should handle expressions with floats in scientific notation', () => { 
      expect(parse("2.3e-1")).toBe(0.23);
      expect(parse("2.3E1")).toBe(23);
      ... // Más tests aquí
    });

  });
```
Estas pruebas permiten comprobar:

- La correcta conversión de números flotantes.

- La interpretación adecuada de notación científica.

- Ignorar correctamente comentarios.

## Referencias

- [Universidad de la laguna - Curso 2025/26 PL](https://campusvirtual.ull.es/2526/ingenieriaytecnologia/course/view.php?id=2526010149)
- [Wikipedia - Syntax-Directed Translation](https://en.wikipedia.org/wiki/Syntax-directed_translation)
- [Wikipedia - Regular Expression](https://en.wikipedia.org/wiki/Regular_expression)
- [Github - Jison Documentation](https://gerhobbelt.github.io/jison/docs/)