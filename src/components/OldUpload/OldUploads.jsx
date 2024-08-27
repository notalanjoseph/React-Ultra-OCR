import { useState, useEffect } from "react";
import "./OldUploads.css"
import {assets} from "../../assets/assets"

import OpenAI from "openai";

const getResponse = async (image) => {

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
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
  //const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (image) {
      //setLoading(true);
      getResponse(image) // might take a while, during which loading! is displayed
        .then((res) => {
          setResponse(res); // re-renders component with the output
          //setLoading(false);
        })
        .catch((error) => {
          console.error("Error getting response:", error);
          //setLoading(false);
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
/*
const OldUploads = ({ image }) => {

/*  
  const [image, setImage] = useState(assets.user_icon);

  const handleNewImage = () => {
    setImage(NewUploadImage);
  };

  return (
    <div id="OldUploads">
        { // image is initially null.
        image ? (
          <div className="OldUpload">
            <img 
              src={URL.createObjectURL(image)} 
              alt="image"
              className="image"
            />
            {getResponse(image)}
          </div>
        )
        : (
          <div>
            click on gallery to upload an image
          </div>
          )
        }

{/*
      <div className="OldUpload">
        <img src={image} alt="user icon" />
      </div>
}
    </div>
  )
}
*/
export default OldUploads

