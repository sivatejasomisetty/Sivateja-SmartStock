import os
import sys
from google import genai
from google.genai.errors import APIError
from dotenv import load_dotenv  # <-- NEW

def get_api_key():
    """
    Retrieves the API key from .env file (preferred),
    Environment Variables, or direct string.
    """
    # Load variables from .env file
    load_dotenv()

    # 1. Try Environment Variable (Best for Local/Server)
    key = os.getenv("GEMINI_API_KEY")
    if key:
        print("Successfully loaded API key from .env or environment.")
        return key

    # 2. Fallback: Paste key here if testing locally (Not recommended for sharing)
    # return "your_actual_api_key_here"

    return None

def run_chat_session():
    """
    Initializes a multi-turn chat session with the Gemini model.
    """
    print("--- Starting Gemini Chat Session ---")

    api_key = get_api_key()

    if not api_key:
        print("\nFATAL ERROR: API Key not found.")
        print("1. Ensure you have a `.env` file with GEMINI_API_KEY set.")
        print("   Example: GEMINI_API_KEY=your_actual_api_key_here")
        print("2. Or set GEMINI_API_KEY as an environment variable.")
        return  # Exit function cleanly

    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        print(f"\nFATAL ERROR during client initialization: {e}")
        return

    # 1. Create the chat component
    try:
        chat = client.chats.create(
            model="gemini-2.5-flash",
            config={
                "system_instruction": "You are a friendly and encouraging Python programming tutor. Always answer concisely and use code examples where helpful."
            }
        )
        print("Model: gemini-2.5-flash (Python Tutor Persona)")
        print("Type 'quit' or 'exit' to end the session.")
        print("-" * 40)
    except APIError as e:
        print(f"\nFATAL ERROR during chat creation: Could not create chat session.")
        print(f"Details: {e}")
        return
    except Exception as e:
        print(f"\nAn unexpected error occurred: {e}")
        return

    # 2. Main conversation loop
    while True:
        try:
            user_input = input("You: ")

            if user_input.lower() in ["quit", "exit"]:
                print("\nEnding chat session. Goodbye!")
                break

            if not user_input.strip():
                continue

            print("Gemini: ...", end="\r")

            response = chat.send_message(user_input)

            print("Gemini: ", end="")  # Overwrite the "..."
            print(f"{response.text}\n")

        except APIError as e:
            print(f"\n[API Error] {e}")
            break
        except Exception as e:
            print(f"\n[Error] {e}")
            break


if __name__ == "__main__":
    run_chat_session()