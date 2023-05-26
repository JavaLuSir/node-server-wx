const { Configuration, OpenAIApi } = require("openai");
module.exports={
    async chat(prompt){
        const configuration = new Configuration({
            apiKey: 'xxx',
          });
          const openai = new OpenAIApi(configuration);
          
          const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0.0, 
            presence_penalty: 0.6,
            stop: [" Human:", " AI:"],
          });
          console.log(response.data.choices[0])
          
          return response.data.choices[0].text;
    }
}
