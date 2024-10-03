import azure.functions as func
import logging
import requests
import json
from dotenv import load_dotenv
import os

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)

@app.route(route="ultra_http_trigger")
def ultra_http_trigger(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Processed a request!')

    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    # Handle OPTIONS request for CORS preflight
    if req.method == "OPTIONS":
        return func.HttpResponse(status_code=204, headers=cors_headers)

    try:
        # Attempt to get JSON body
        try:
            req_body = req.get_json()
        except ValueError:
            return func.HttpResponse("Invalid JSON in request body.", status_code=400)

        # Extract image field from the JSON body
        image_base64 = req_body.get('image')

        if not image_base64:
            return func.HttpResponse("Image data is missing in the request.", status_code=400, headers=cors_headers)

        # OpenAI API configuration
        load_dotenv()
        api_key = os.getenv("OPENAI_API_KEY")
        headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
        openai_url = "https://api.openai.com/v1/chat/completions"
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {
                    "role": "system",
                    "content": [
                        {
                            "text": "Return the text in the image. Insert line breaks in the output corresponding to those in the image.",
                            "type": "text"
                        }
                    ]
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/png;base64,{image_base64}"}
                        }
                    ]
                }
            ],
            "temperature": 1,
            "max_tokens": 256,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0,
            "response_format": {"type": "text"}
        }

        # Send the request to OpenAI API
        response = requests.post(openai_url, headers=headers, data=json.dumps(payload))
        if response.status_code != 200:
            return func.HttpResponse(f"OpenAI API request faileddd with status code {response.status_code}.", status_code=500, headers=cors_headers)

        # Return the response from OpenAI
        output = response.json()['choices'][0]['message']['content']
        return func.HttpResponse(
            json.dumps({"message": output}),
            mimetype="application/json",
            status_code=200,
            headers=cors_headers
        )

    except Exception as e:
        logging.error(f"Error processing request: {str(e)}")
        return func.HttpResponse("Internal server error.", status_code=500, headers=cors_headers)