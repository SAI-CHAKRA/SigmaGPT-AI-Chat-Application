import 'dotenv/config';

const getOpenAI_API_Response = async(messages)=>{
    const options = {
    method: "POST",
    headers:{
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3-8b-instruct",
      messages:[{
        role:"user",
        content:messages 
      }]
    })
  };
  try{
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions',options);
    const data = await response.json();
    // console.log(data.choices[0].message.content);

    // console.log("OpenRouter FULL Response:", data);  -> any error uncomment this line and run it's shows error
    if (data.error) {
      throw new Error(data.error.message);
    }
    if (!data.choices || !data.choices.length) {
      throw new Error("Invalid response from OpenRouter");
    }
    return data.choices[0].message.content;
  } catch(err){
    console.log(err); 
  }
}

export default getOpenAI_API_Response;