import { useState, useEffect } from "react";
import "./OldUploads.css"
import {assets} from "../../assets/assets"

import OpenAI from "openai";

const getResponse = async (image) => {

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY_1+import.meta.env.VITE_OPENAI_API_KEY_2,
    dangerouslyAllowBrowser: true
  });

  // Function to read and encode the image
  const encodeImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(',')[1]); // Get the base64 part only
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  const encodedImage = await encodeImageToBase64(image);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: [
          {
            text: "Return the text in the image. Insert line breaks in the output corresponding to those in the image. ",
            type: "text",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${encodedImage}`,
            },
          },
        ],
      },
    ],
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: {
      type: "text",
    },
  });

  return response.choices[0].message.content
};

const OldUploads = ({ image }) => {
  const [response, setResponse] = useState('loading🐌');

  useEffect(() => {
    if (image) {
      getResponse(image) // might take a while, during which loading! is displayed
        .then((res) => {
          setResponse(res); // re-renders component with the output
        })
        .catch((error) => {
          setResponse("ERROR, api key might be expired");
          console.error("Error getting response:", error);
        });
    }
  }, [image]); // runs on mount and also when image changes

  return (
    <div id="OldUploads">
      {image ? (
        <div className="OldUpload">
          <img src={URL.createObjectURL(image)} alt="image" className="image"/>
          <p>{response}</p>
        </div>
      ) : (
        <p><br/>Upload a PNG or JPG image.</p>
      )}
    </div>
  );
};

export default OldUploads

