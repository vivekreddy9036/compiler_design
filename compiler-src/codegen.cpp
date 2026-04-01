#include "codegen.h"

std::vector<std::string> generateCode(const std::vector<std::string>& ir) {
    std::vector<std::string> code;

    for (const auto& instr : ir) {
        std::string var = instr.substr(5); // remove "DECL "
        code.push_back("ALLOC " + var);
    }

    return code;
}