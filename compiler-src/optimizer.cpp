#include "optimizer.h"
#include <unordered_set>

std::vector<std::string> optimize(const std::vector<std::string>& ir) {
    std::vector<std::string> optimized;
    std::unordered_set<std::string> seen;

    for (const auto& instr : ir) {
        if (seen.find(instr) == seen.end()) {
            optimized.push_back(instr);
            seen.insert(instr);
        }
    }

    return optimized;
}