#include "lexer.h"
#include <cctype>
#include <iostream>

std::vector<Token> tokenize(const std::string& code) {
    std::vector<Token> tokens;

    std::string word = "";
    int line = 1;

    for (size_t i = 0; i < code.length(); i++) {
        char c = code[i];

        // Track line numbers
        if (c == '\n') {
            line++;
            continue;
        }

        // If whitespace → finalize word
        if (isspace(c)) {
            if (!word.empty()) {
                if (word == "int") {
                    tokens.push_back({"KEYWORD", word, line});
                } else {
                    tokens.push_back({"IDENTIFIER", word, line});
                }
                word = "";
            }
        }
        // Handle braces
        else if (c == '{' || c == '}') {
            if (!word.empty()) {
                if (word == "int") {
                    tokens.push_back({"KEYWORD", word, line});
                } else {
                    tokens.push_back({"IDENTIFIER", word, line});
                }
                word = "";
            }

            tokens.push_back({"BRACE", std::string(1, c), line});
        }
        // Handle semicolon
        else if (c == ';') {
            if (!word.empty()) {
                if (word == "int") {
                    tokens.push_back({"KEYWORD", word, line});
                } else {
                    tokens.push_back({"IDENTIFIER", word, line});
                }
                word = "";
            }

            tokens.push_back({"SEMICOLON", ";", line});
        }
        else {
            word += c;
        }
    }

    // Last word
    if (!word.empty()) {
        if (word == "int") {
            tokens.push_back({"KEYWORD", word, line});
        } else {
            tokens.push_back({"IDENTIFIER", word, line});
        }
    }

    return tokens;
}