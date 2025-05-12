export const getJudge0LangagueId = (language) => {
  const languages = {
    "python": 71,
    "javascript": 63,
    "java": 62
  }
  return languages[language.toLowerCase()]
}
