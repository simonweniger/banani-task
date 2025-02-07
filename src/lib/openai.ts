import {OpenAI}  from "openai";

const openai = new OpenAI(
  {
    apiKey: process.env.OPENAI_API_KEY,
    defaultQuery: {
      model: process.env.OPENAI_API_MODEL
    },
  }
);

export default openai