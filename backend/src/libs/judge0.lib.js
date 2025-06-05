import axios from "axios";
import dotenv from "dotenv";

dotenv.config("../../");

export const getJudge0LangagueId = (language) => {
  const languages = {
    python: 71,
    javascript: 63,
    java: 62,
  };
  return languages[language.toLowerCase()];
};

export const submitBatch = async (submissions) => {
  // to transform the submissions to the format required by Judge0 API
  let functionDeclared;
  if (submissions[0].language_id == 62) {
    functionDeclared = submissions[0].source_code.match(
      /\b(?:public|private|protected)?\s*(?:static\s+)?\w+\s+(\w+)\s*\(/,
    );
  } else if (submissions[0].language_id == 63) {
    functionDeclared = submissions[0].source_code.match(
      /function\s+(\w+)\s*\(/,
    );
  } else {
    functionDeclared = submissions[0].source_code.match(/def\s+(\w+)\s*\(/);
  }

  const extractedFunction = functionDeclared[1];

  console.log("this is extracted function: ", extractedFunction);

  const judge0Input = {
    63: `// Add readline for dynamic input handling
   const readline = require('readline');
   const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
   });

   // Process input line
  rl.on('line', (line) => {
   // Call solution with the input string
   const result = ${extractedFunction}(line);

   // Output the result
   console.log(result ? "true" : "false");
   rl.close();
  });`,

    71: `# Input parsing
if __name__ == "__main__":
    import sys
    # Read the input string
    s = sys.stdin.readline().strip()

    # Try to convert to int if it's a number
    if s.isdigit() or (s.startswith('-') and s[1:].isdigit()):
        s = int(s)

    # Call solution
    sol = Solution()
    result = sol.${extractedFunction}(s)

    # Output result
    print(str(result).lower())  # Convert True/False to lowercase true/false
   `,

    62: [
      `import java.util.Scanner;
     public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }`,
      `    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();

        boolean result = ${extractedFunction}(input);
        System.out.println(result ? "true" : "false");
    }
     }`,
    ],
  };

  const finalSubmissions = submissions.map((submission) => ({
    // source_code: finalSourceCode,
    source_code:
      submission.language_id == 62
        ? judge0Input[62][0] + submission.source_code + judge0Input[62][1]
        : submission.source_code + judge0Input[submission.language_id],
    language_id: submission.language_id,
    stdin: submission.stdin,
  }));

  const { data } = await axios.post(
    `http://${process.env.JUDGE0_API}/submissions/batch?base64_encoded=false`,
    { submissions: finalSubmissions },
  );

  return data; // arrays of token
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatch = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `http://${process.env.JUDGE0_API}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
      },
    );

    const results = data.submissions;

    /* {
      "id": 1,
        "description": "In Queue"
    },
    {
      "id": 2,
        "description": "Processing"
    },
    {
      "id": 3,
        "description": "Accepted"
    },
    {
      "id": 4,
        "description": "Wrong Answer"
    }, */

    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2,
    );

    if (isAllDone) {
      return results;
    }

    await sleep(1000); // wait for 1 seconds before hitting the endpoint again
  }
};

export const getLanguageName = (languageId) => {
  const language = {
    71: "python",
    63: "javascript",
    62: "java",
  };

  return language[languageId] || "Unknown";
};
