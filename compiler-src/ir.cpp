#include "ir.h"

std::vector<std::string> generateIR(const std::vector<Statement>& parsed) {
    std::vector<std::string> ir;

    for (const auto& stmt : parsed) {
        if (stmt.type == "DECL") {
            ir.push_back("DECL " + stmt.value);
        }
    }

    return ir;
}