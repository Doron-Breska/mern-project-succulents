import { Configuration, OpenAIApi } from "openai";


const aiRole = 
`Your role is to be a professional botanist.
Each time I will provide you a species of plant.
You need to send me back a guidance for how to grow and maintain this species of plant and also mention some info about this species. 
I want to get the response in one string of text. 
}`



const openAiConfig = async (speciesName) => {

 let prompt = aiRole.replace(/SPECIES_NAME/g, speciesName);

  const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
      
  });
  const openai = new OpenAIApi(configuration);
 
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  console.log("respond from open ai" , response.data);
  return response.data;
};


export default openAiConfig;






