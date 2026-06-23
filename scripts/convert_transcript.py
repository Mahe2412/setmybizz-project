import json
import os

transcript_path = r"C:\Users\mahen\.gemini\antigravity-ide\brain\efa1dee7-0f9d-421d-9ddc-4d85b395a802\.system_generated\logs\transcript.jsonl"
output_path = r"C:\Users\mahen\OneDrive\Desktop\setmybizz-project\ITR_GST_Agent_Chat_History.md"

if not os.path.exists(transcript_path):
    print(f"Error: {transcript_path} not found")
    exit(1)

chat_history = []
with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            source = data.get("source")
            step_type = data.get("type")
            content = data.get("content")
            
            # We want USER_INPUT and PLANNER_RESPONSE
            if step_type == "USER_INPUT" and content:
                chat_history.append(f"## 👤 User\n\n{content}\n")
            elif step_type == "PLANNER_RESPONSE" and content:
                # Filter out system directives if any
                chat_history.append(f"## 🤖 Antigravity Agent\n\n{content}\n")
        except Exception as e:
            continue

with open(output_path, 'w', encoding='utf-8') as out:
    out.write("# ITR and GST Agent Development - Chat History\n\n")
    out.write("This document contains the complete chat history of the previous session where the ITR and GST AGI agent was planned and built.\n\n---\n\n")
    out.write("\n---\n".join(chat_history))

print("Successfully generated Chat History!")
