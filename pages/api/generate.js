import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid question",
      }
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model:"gpt-3.5-turbo",
      messages: [{role: "user", content:generatePrompt(animal)}],
      max_tokens: 4096,
    });
    // const completion = await openai.createCompletion({
    //   model: "gpt-3.5-turbo",
    //   prompt: generatePrompt(animal),
    //   temperature: 0.6,
    //   max_tokens: 500,
    // });
    let ans =  completion.data.choices[0].message.content;
    res.status(200).json({ result: ans });
    console.log('Q:', req.body.animal, '\nA:', ans);
    console.log(">>>>>>>>>>分割线>>>>>>>>>>");
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(question) {
  return question
}
