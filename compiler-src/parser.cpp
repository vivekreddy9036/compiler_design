#include "parser.h"
#include <iostream>

std::vector<Statement> parse(const std::vector<Token>& tokens) {
    std::vector<Statement> parsed;

    for (size_t i = 0; i < tokens.size(); i++) {

        if (tokens[i].type == "KEYWORD" && tokens[i].value == "int") {

            if (i + 2 < tokens.size() &&
                tokens[i + 1].type == "IDENTIFIER" &&
                tokens[i + 2].type == "SEMICOLON") {

                parsed.push_back({
                    "DECL",
                    tokens[i + 1].value,
                    tokens[i].line
                });

                i += 2;
            } else {
                std::cout << "[Syntax Error] Invalid declaration at line "
                          << tokens[i].line << std::endl;
            }
        }

        else if (tokens[i].type == "BRACE" && tokens[i].value == "{") {
            parsed.push_back({"ENTER_SCOPE", "", tokens[i].line});
        }

        else if (tokens[i].type == "BRACE" && tokens[i].value == "}") {
            parsed.push_back({"EXIT_SCOPE", "", tokens[i].line});
        }
    }

    return parsed;
}