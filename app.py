from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from google import genai
from google.genai import types
import os
import json
import re

load_dotenv()

app = Flask(__name__)

# Get Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("WARNING: GEMINI_API_KEY is missing!")

client = genai.Client(api_key=api_key) if api_key else None


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/generate-passport", methods=["POST"])
def generate_passport():

    if not client:
        return jsonify({
            "error": "Gemini API key is missing. Check your .env file."
        }), 500

    if "image" not in request.files:
        return jsonify({
            "error": "No image uploaded."
        }), 400

    image = request.files["image"]

    if image.filename == "":
        return jsonify({
            "error": "Please select an image."
        }), 400

    try:

        image_bytes = image.read()

        mime_type = image.mimetype or "image/jpeg"

        prompt = """
You are an extremely serious immigration officer for NON-LIVING OBJECTS.

Look carefully at the uploaded image.

Identify the main NON-LIVING OBJECT and create a hilarious,
absurd but believable official passport for it.

The passport should contain fictional information based on the object.

Be creative and funny.

Return ONLY valid JSON.
Do not use markdown.
Do not put the JSON inside code fences.

Use EXACTLY this structure:

{
    "object_name": "",
    "passport_number": "",
    "nationality": "",
    "age": "",
    "occupation": "",
    "personality": "",
    "immigration_status": "",
    "criminal_record": "",
    "travel_history": [],
    "favourite_activity": "",
    "life_story": "",
    "health_status": "",
    "estimated_lifespan": "",
    "status": "ALIVE"
}

Rules:

- passport_number must look like a fictional passport number.
- nationality should be a funny fictional nationality or place.
- age should be appropriate for the object.
- occupation should be funny.
- personality should describe the object's imaginary personality.
- criminal_record should be absurd but harmless.
- travel_history should contain 3-5 funny locations or events.
- favourite_activity should be funny.
- life_story should be 2-4 sentences.
- health_status should be humorous.
- estimated_lifespan should be humorous.
- status should normally be "ALIVE".
"""

        image_part = types.Part.from_bytes(
            data=image_bytes,
            mime_type=mime_type
        )

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=[
                image_part,
                prompt
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )

        text = response.text.strip()

        # Remove accidental markdown formatting
        text = re.sub(r"```json\s*", "", text)
        text = re.sub(r"```\s*", "", text)

        passport = json.loads(text)

        return jsonify(passport)

    except json.JSONDecodeError:
        return jsonify({
            "error": "AI returned an invalid passport. Please try again."
        }), 500

    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)