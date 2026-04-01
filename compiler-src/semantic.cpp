#include "semantic.h"
#include <iostream>
#include <stack>
#include <unordered_map>

class SymbolTable {
    std::stack<std::unordered_map<std::string, std::string>> scopes;

public:
    SymbolTable() {
        scopes.push({});
    }

    void enterScope() {
        scopes.push({});
    }

    void exitScope() {
        if (!scopes.empty())
            scopes.pop();
    }

    bool declare(const std::string& var) {
        auto& current = scopes.top();

        if (current.find(var) != current.end()) {
            return false; // redeclaration
        }

        current[var] = "int";
        return true;
    }
};

// ✅ CHANGE: return bool
bool analyze(const std::vector<Statement>& parsed) {

    SymbolTable st;
    bool hasError = false;

    for (const auto& stmt : parsed) {

        if (stmt.type == "ENTER_SCOPE") {
            st.enterScope();
        }

        else if (stmt.type == "EXIT_SCOPE") {
            st.exitScope();
        }

        else if (stmt.type == "DECL") {
            if (!st.declare(stmt.value)) {
                std::cout << "Error: Variable '" << stmt.value
                          << "' redeclared at line "
                          << stmt.line << std::endl;

                hasError = true;
            }
        }
    }

    if (!hasError) {
        std::cout << "No semantic errors.\n";
    }

    return hasError;  // ✅ IMPORTANT
}