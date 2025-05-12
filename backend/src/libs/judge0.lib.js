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
