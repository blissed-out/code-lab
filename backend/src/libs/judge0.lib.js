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
  //

  if (submissions[0].language_id == 62) {
    const { data } = await axios.post(
      `http://${process.env.JUDGE0_API}/submissions/batch?base64_encoded=false`,
      { submissions },
    );

    return data;
  }

  let functionDeclared;
  if (submissions[0].language_id == 63) {
    functionDeclared = submissions[0].source_code.match(
      /function\s+(\w+)\s*\(/,
    );
  } else {
    functionDeclared = submissions[0].source_code.match(/def\s+(\w+)\s*\(/);
  }

  const extractedFunction = functionDeclared[1];
  console.log("this is extracted function: ", extractedFunction);

  const judge0InputForInteger = {
    63: `// Add readline for dynamic input handling
   const readline = require('readline');
   const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
   });

   // Process input line
  rl.on('line', (line) => {
  const args = line.split(' ').map(Number);

   // Call solution with the input string
   const result = ${extractedFunction}(...args);

   // Output the result
   console.log(result);
   rl.close();
  });`,

    71: `\n#Input parsing
if __name__ == "__main__":
    import sys

    # Read the input string and convert to integer
    s = sys.stdin.readline().strip() 
    args = list(map(int, s.split()))

    # Call solution
    sol = Solution()
    result = sol.${extractedFunction}(*args)

    # Output result
    print(str(result).lower() if isinstance(result, bool) else result)
   `,
  };

  const judge0InputForString = {
    63: `// Add readline for dynamic input handling
   const readline = require('readline');
   const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
   });

   // Process input line
  rl.on('line', (line) => {
  const args = line.split(' ');

   // Call solution with the input string
   const result = ${extractedFunction}(...args);

   // Output the result
   console.log(result);
   rl.close();
  });`,

    71: `\n#Input parsing
if __name__ == "__main__":
    import sys
    # Read the input string
    s = sys.stdin.readline().strip()
    args = s.split(" ")

    # Call solution
    sol = Solution()
    result = sol.${extractedFunction}(*args)

    # Output result
    print(str(result).lower() if isinstance(result, bool) else result)
   `,
  };
  // print(str(result).lower() if isinstance(result, bool) else result)
  // print(str(result).lower() if result == "True" or result == "False" else result) # change True/False to lowercase true/false

  // check input type

  console.log("this is submission stdin: ", submissions[0].stdin);
  let parsedInput;
  let inputType;

  try {
    parsedInput = JSON.parse(submissions[0].stdin.split(" ")[0]);
    console.log("try block");
    inputType = typeof parsedInput;
  } catch (error) {
    console.log("catch block");
    inputType = "string";
  }

  let judge0Input;

  if (inputType == "number") {
    judge0Input = judge0InputForInteger;
  } else {
    judge0Input = judge0InputForString;
  }

  console.log("this is input type:", inputType);
  console.log("judge0 for python: ", judge0Input[71][0], judge0Input[71][1]);

  const finalSubmissions = submissions.map((submission) => ({
    source_code:
      submission.language_id == 62
        ? source_code
        : submission.language_id == 71
          ? submission.source_code + judge0Input[71]
          : submission.source_code + judge0Input[63],
    language_id: submission.language_id,
    stdin: submission.stdin,
  }));

  console.log("this is final submissions: ", finalSubmissions);

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
