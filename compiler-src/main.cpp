#include <iostream>
#include <fstream>
#include <vector>

#include "lexer.h"
#include "parser.h"
#include "semantic.h"
#include "ir.h"
#include "optimizer.h"
#include "codegen.h"

using namespace std;

int main(int argc, char* argv[]) {

    // ---------------- CLI VALIDATION ----------------
    if (argc < 2) {
        cout << "Usage: ./mycompiler <inputfile> [-o outputfile]\n";
        return 1;
    }

    string inputFile = argv[1];
    string outputFile = "output.txt"; // default output

    if (argc == 4 && string(argv[2]) == "-o") {
        outputFile = argv[3];
    }

    // ---------------- FILE INPUT ----------------
    ifstream file(inputFile);

    if (!file) {
        cout << "Error: Unable to open input file\n";
        return 1;
    }

    string code((istreambuf_iterator<char>(file)),
                 istreambuf_iterator<char>());

    if (code.empty()) {
        cout << "Error: Input file is empty\n";
        return 1;
    }

    // ---------------- LEXICAL ANALYSIS ----------------
    auto tokens = tokenize(code);

    cout << "\n=============================\n";
    cout << "   LEXICAL ANALYSIS\n";
    cout << "=============================\n";

    for (auto& t : tokens) {
        cout << "(" << t.type << ", " << t.value
             << ", line " << t.line << ")\n";
    }

    // ---------------- SYNTAX ANALYSIS ----------------
    auto parsed = parse(tokens);

    cout << "\n=============================\n";
    cout << "   SYNTAX ANALYSIS\n";
    cout << "=============================\n";

    for (auto& stmt : parsed) {
        cout << stmt.type;

        if (!stmt.value.empty())
            cout << " " << stmt.value;

        cout << " (line " << stmt.line << ")\n";
    }

    // ---------------- SEMANTIC ANALYSIS ----------------
    cout << "\n=============================\n";
    cout << "   SEMANTIC ANALYSIS\n";
    cout << "=============================\n";

    bool hasError = analyze(parsed);

    if (hasError) {
        cout << "\n=============================\n";
        cout << "   COMPILATION FAILED\n";
        cout << "=============================\n";
        return 1;
    }

    // ---------------- INTERMEDIATE CODE ----------------
    auto ir = generateIR(parsed);

    cout << "\n=============================\n";
    cout << "   INTERMEDIATE CODE\n";
    cout << "=============================\n";

    for (auto& i : ir)
        cout << i << endl;

    // ---------------- OPTIMIZATION ----------------
    auto optimized = optimize(ir);

    cout << "\n=============================\n";
    cout << "   OPTIMIZED CODE\n";
    cout << "=============================\n";

    for (auto& i : optimized)
        cout << i << endl;

    // ---------------- CODE GENERATION ----------------
    auto target = generateCode(optimized);

    cout << "\n=============================\n";
    cout << "   TARGET CODE\n";
    cout << "=============================\n";

    for (auto& t : target)
        cout << t << endl;

    // ---------------- WRITE OUTPUT FILE ----------------
    ofstream out(outputFile);

    if (!out) {
        cout << "Error: Unable to write output file\n";
        return 1;
    }

    for (auto& t : target)
        out << t << endl;

    out.close();

    // ---------------- FINAL OUTPUT ----------------
    cout << "\n=============================\n";
    cout << "   COMPILATION SUCCESSFUL\n";
    cout << "=============================\n";

    cout << "Output written to: " << outputFile << endl;

    return 0;
}