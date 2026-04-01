#pragma once
#include <string>
#include <vector>

// Token structure
struct Token {
    std::string type;
    std::string value;
    int line;
};

// Lexer function
std::vector<Token> tokenize(const std::string& code);