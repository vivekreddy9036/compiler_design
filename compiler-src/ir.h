#pragma once
#include "parser.h"
#include <vector>
#include <string>

std::vector<std::string> generateIR(const std::vector<Statement>& parsed);