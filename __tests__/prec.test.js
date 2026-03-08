/**
 * Jest tests for the operation precedence of the grammar
 * 
 */

const parse = require("../src/parser.js").parse;

describe('Parser Precedence test', () => {
  test('should handle multiplication and division before addition and subtraction', () => {
    expect(parse("2 + 3 * 4")).toBe(14); // 2 + (3 * 4) = 14
    expect(parse("10 - 6 / 2")).toBe(7); // 10 - (6 / 2) = 7
    expect(parse("5 * 2 + 3")).toBe(13); // (5 * 2) + 3 = 13
    expect(parse("20 / 4 - 2")).toBe(3); // (20 / 4) - 2 = 3
  });
  
  test('should handle exponentiation with highest precedence', () => {
    expect(parse("2 + 3 ** 2")).toBe(11); // 2 + (3 ** 2) = 11
    expect(parse("2 * 3 ** 2")).toBe(18); // 2 * (3 ** 2) = 18
    expect(parse("10 - 2 ** 3")).toBe(2); // 10 - (2 ** 3) = 2
  });
 
  test('should handle right associativity for exponentiation', () => {
    expect(parse("2 ** 3 ** 2")).toBe(512); // 2 ** (3 ** 2) = 2 ** 9 = 512
    expect(parse("3 ** 2 ** 2")).toBe(81); // 3 ** (2 ** 2) = 3 ** 4 = 81
  });
 
  test('should handle mixed operations with correct precedence', () => {
    expect(parse("1 + 2 * 3 - 4")).toBe(3); // 1 + (2 * 3) - 4 = 3
    expect(parse("15 / 3 + 2 * 4")).toBe(13); // (15 / 3) + (2 * 4) = 13
    expect(parse("10 - 3 * 2 + 1")).toBe(5); // 10 - (3 * 2) + 1 = 5
  });
 
  test('should handle expressions with exponentiation precedence', () => {
    expect(parse("2 ** 3 + 1")).toBe(9); // (2 ** 3) + 1 = 9
    expect(parse("3 + 2 ** 4")).toBe(19); // 3 + (2 ** 4) = 19
    expect(parse("2 * 3 ** 2 + 1")).toBe(19); // 2 * (3 ** 2) + 1 = 19
  });
 
  test('should handle various realistic calculations with correct precedence', () => {
    expect(parse("1 + 2 * 3")).toBe(7); // 1 + (2 * 3) = 7
    expect(parse("6 / 2 + 4")).toBe(7); // (6 / 2) + 4 = 7
    expect(parse("2 ** 2 + 1")).toBe(5); // (2 ** 2) + 1 = 5
    expect(parse("10 / 2 / 5")).toBe(1); // (10 / 2) / 5 = 1
    expect(parse("100 - 50 + 25")).toBe(75); // (100 - 50) + 25 = 75
    expect(parse("2 * 3 + 4 * 5")).toBe(26); // (2 * 3) + (4 * 5) = 26
  });

  describe('Precedence with floating point', () => {
    test('should handle multiplication and division before addition and subtraction', () => {
      expect(parse("2.5 + 3.0 * 4.0")).toBe(14.5); // 2.5 + (3.0 * 4.0) = 14.5
      expect(parse("10.0 - 6.0 / 2.0")).toBe(7.0); // 10.0 - (6.0 / 2.0) = 7
      expect(parse("5.0 * 2.5 + 3.0")).toBe(15.5); // (5.0 * 2.5) + 3.0 = 15.5
      expect(parse("20.0 / 4.0 - 2.0")).toBe(3.0); // (20.0 / 4.0) - 2.0 = 3
    });

    test('should handle exponentiation with highest precedence', () => {
      expect(parse("2.0 + 3.0 ** 2.0")).toBe(11.0); // 2.0 + (3.0 ** 2.0) = 11
      expect(parse("2.0 * 3.0 ** 2.0")).toBe(18.0); // 2.0 * (3.0 ** 2.0) = 18
      expect(parse("10.0 - 2.0 ** 3.0")).toBe(2.0); // 10.0 - (2.0 ** 3.0) = 2
    });

    test('should handle right associativity for exponentiation', () => {
      expect(parse("2.0 ** 3.0 ** 2.0")).toBe(512.0); // 2 ** (3 ** 2)
      expect(parse("3.0 ** 2.0 ** 2.0")).toBe(81.0); // 3 ** (2 ** 2)
    });

    test('should handle mixed operations with correct precedence', () => {
      expect(parse("1.0 + 2.0 * 3.0 - 4.0")).toBe(3.0); // 1 + (2 * 3) - 4
      expect(parse("15.0 / 3.0 + 2.0 * 4.0")).toBe(13.0); // (15 / 3) + (2 * 4)
      expect(parse("10.0 - 3.0 * 2.0 + 1.0")).toBe(5.0); // 10 - (3 * 2) + 1
    });

    test('should handle expressions with exponentiation precedence', () => {
      expect(parse("2.0 ** 3.0 + 1.0")).toBe(9.0); // (2 ** 3) + 1
      expect(parse("3.0 + 2.0 ** 4.0")).toBe(19.0); // 3 + (2 ** 4)
      expect(parse("2.0 * 3.0 ** 2.0 + 1.0")).toBe(19.0); // 2 * (3 ** 2) + 1
    });

    test('should handle various realistic calculations with correct precedence', () => {
      expect(parse("1.5 + 2.0 * 3.0")).toBe(7.5); // 1.5 + (2 * 3)
      expect(parse("6.0 / 2.0 + 4.5")).toBe(7.5); // (6 / 2) + 4.5
      expect(parse("2.0 ** 2.0 + 1.5")).toBe(5.5); // (2 ** 2) + 1.5
      expect(parse("10.0 / 2.0 / 5.0")).toBe(1.0); // (10 / 2) / 5
      expect(parse("100.0 - 50.5 + 25.5")).toBe(75.0); // (100 - 50.5) + 25.5
      expect(parse("2.5 * 3.0 + 4.0 * 5.0")).toBe(27.5); // (2.5 * 3) + (4 * 5)
    });
  });
  
  describe('Precedence with parenthesis', () => {
    test('should override normal precedence with parentheses', () => {
      expect(parse("(2 + 3) * 4")).toBe(20); // (2 + 3) * 4
      expect(parse("(10 - 6) / 2")).toBe(2); // (10 - 6) / 2
      expect(parse("(5 * 2) + 3")).toBe(13); // (5 * 2) + 3
      expect(parse("(20 / 4) - 2")).toBe(3); // (20 / 4) - 2
    });
  
    test('should change result compared to default precedence', () => {
      expect(parse("(2 + 3) * 4")).toBe(20); // sin paréntesis sería 14
      expect(parse("(10 - 2) * 3")).toBe(24); // sin paréntesis sería 4
      expect(parse("(8 + 4) / 2")).toBe(6); // sin paréntesis sería 10
    });
  
    test('should handle parentheses with exponentiation', () => {
      expect(parse("(2 + 3) ** 2")).toBe(25); // (2 + 3)^2
      expect(parse("(3 * 2) ** 3")).toBe(216); // (3 * 2)^3
      expect(parse("(10 - 7) ** 2")).toBe(9); // (10 - 7)^2
    });
  
    test('should handle nested parentheses', () => {
      expect(parse("((2 + 3) * (4 + 1))")).toBe(25);
      expect(parse("(2 * (3 + (4 * 2)))")).toBe(22);
      expect(parse("((1 + 2) * (3 + 4))")).toBe(21);
    });
  
    test('should handle parentheses mixed with exponentiation precedence', () => {
      expect(parse("(2 ** 3) ** 2")).toBe(64); // (2^3)^2
      expect(parse("2 ** (3 ** 2)")).toBe(512); // 2^(3^2)
      expect(parse("(3 + 1) ** (2 + 1)")).toBe(64);
    });
  
    test('should handle complex expressions with parentheses', () => {
      expect(parse("(1 + 2) * (3 + 4)")).toBe(21);
      expect(parse("(15 / (3 + 2)) * 4")).toBe(12);
      expect(parse("(10 - (3 * 2)) + 1")).toBe(5);
      expect(parse("((2 + 3) * 4) + (5 * 2)")).toBe(30);
    });
  });

});
