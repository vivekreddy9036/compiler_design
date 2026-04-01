#pragma once
#include "lexer.h"
#include <vector>
#include <string>

// Parsed statement
struct Statement {
    std::string type;
    std::string value;
    int line;
};

std::vector<Statement> parse(const std::vector<Token>& tokens);