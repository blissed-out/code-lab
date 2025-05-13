import axios from "axios"

export const getJudge0LangagueId = (language) => {
  const languages = {
    "python": 71,
    "javascript": 63,
    "java": 62
  }
  return languages[language.toLowerCase()]
}

export const submitBatch = async (submissions) => {

  const { data } = axios.post(`${process.env.JUDGE0_API}/submissions/batch?base64_encoded=false`, submissions);

  console.log("submitBatch data: ", data);

  return data // arrays of token
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatch = async (tokens) => {

  while (true) {

    const { data } = await axios.get(`${process.env.JUDGE0_API}/submissions/batch`, {
      params: {
        tokens: tokens.join(","),
        base64_encoded: false
      }
    });


    const results = data.submissions.status_id;

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

    const isAllDone = results.every(results !== 1 && results !== 2);

    if (isAllDone) {
      return results
    }

    await sleep(1000); // wait for 1 seconds before hitting the endpoint again

  }
}
