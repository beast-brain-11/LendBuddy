import streamlit as st
import requests
import pymongo
from datetime import datetime

# MongoDB setup
MONGO_URI = "mongodb+srv://prajwaljoshi51:Unpredictable00@cluster0.hrwzd.mongodb.net/"
DB_NAME = "lendbuddy"
COLLECTION_NAME = "chat_history"

client = pymongo.MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Webhook URL
N8N_WEBHOOK_URL = "https://n8n-n8n.p8w03v.easypanel.host/webhook/2bd83275-601a-4be5-9714-c970d6c1b9e7"

# Ensure session state variables are initialized
if "messages" not in st.session_state:
    st.session_state.messages = []

# Streamlit UI setup
st.title("💬 Conversational Chatbot")
st.write("Chat with the assistant via text!")

# Load last 50 messages from MongoDB
def load_chat_history():
    return list(collection.find({}, {"_id": 0}).sort("timestamp", -1).limit(50))[::-1]

# Save messages to MongoDB
def save_message(role, message, message_type="text"):
    entry = {"role": role, "message": message, "message_type": message_type, "timestamp": datetime.utcnow()}
    collection.insert_one(entry)

# Initialize session state for chat history
if "messages" not in st.session_state:
    st.session_state.messages = load_chat_history()

# Layout: Text input and button
user_input = st.text_input("Type your message...")
if st.button("📩 Send") and user_input:
    # Disable the button to prevent multiple clicks
    with st.spinner("Waiting for the assistant's response..."):
        try:
            # Send the user's text input to the webhook
            response = requests.post(N8N_WEBHOOK_URL, json={"text": user_input}, timeout=30)  # Set a timeout
            print(response)
            
            # Check if the request was successful
            if response.status_code == 200:
                # Parse the JSON response
                response_data = response.json()
                print(response_data)
                
                # Extract the translated_text from the response
                if isinstance(response_data, list) and len(response_data) > 0:
                    translated_text = response_data[0].get("translated_text", "No translation found.")
                else:
                    translated_text = "No translation found."
                
                # Save the user's message and the AI's response to MongoDB
                save_message("user", user_input)
                save_message("assistant", translated_text)
                
                # Update the session state with the new messages
                st.session_state.messages.append({"role": "user", "message": user_input})
                st.session_state.messages.append({"role": "assistant", "message": translated_text})
            else:
                st.error(f"Failed to get a response from the server. Status code: {response.status_code}")
        except requests.exceptions.RequestException as e:
            st.error(f"An error occurred while communicating with the backend: {e}")

# Display Assistant's Response with Formatting
st.write("---")
st.subheader("Assistant's Response")
if st.session_state.messages and st.session_state.messages[-1]["role"] == "assistant":
    assistant_response = st.session_state.messages[-1]["message"]
    
    # Format the assistant's response
    st.markdown(
        f"""
        <div style="
            background-color: #f0f2f6;
            padding: 15px;
            border-radius: 10px;
            margin: 10px 0;
            color: #333;
            font-size: 16px;
        ">
            🤖 **Assistant**: {assistant_response}
        </div>
        """,
        unsafe_allow_html=True
    )
else:
    st.info("No response from the assistant yet.")

# Display Chat History
st.write("---")
st.subheader("Chat History")
for message in st.session_state.messages:
    role_icon = "👤" if message["role"] == "user" else "🤖"
    st.markdown(f"{role_icon} **{message['role'].capitalize()}**: {message['message']}")    