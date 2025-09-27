import gradio as gr
import os
import json
from typing import List, Tuple
import google.generativeai as genai

# Configure Gemini AI with API key from Hugging Face secrets
# The API key will be set as a secret in Hugging Face Spaces
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class AnveshAI:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.5-pro')
        self.conversation_history = []
        
    def get_system_prompt(self) -> str:
        return """You are AnveshAI, an intelligent and helpful AI assistant. You are knowledgeable, conversational, and can help with a wide variety of topics including:

- Programming and coding in any language
- General questions and conversations
- Problem-solving and analysis
- Creative writing and brainstorming
- Technical explanations
- And much more

Respond in a helpful, friendly, and professional manner. If you're helping with code, provide clear explanations and well-formatted code examples. Be concise but thorough in your responses."""

    def chat_response(self, message: str, history: List[Tuple[str, str]]) -> Tuple[str, List[Tuple[str, str]]]:
        try:
            # Build conversation context from history
            conversation = []
            
            # Add system prompt
            conversation.append({
                "role": "user",
                "parts": [self.get_system_prompt()]
            })
            conversation.append({
                "role": "model", 
                "parts": ["Hello! I'm AnveshAI, your intelligent assistant. How can I help you today?"]
            })
            
            # Add conversation history
            for user_msg, ai_msg in history:
                if user_msg:
                    conversation.append({"role": "user", "parts": [user_msg]})
                if ai_msg:
                    conversation.append({"role": "model", "parts": [ai_msg]})
            
            # Add current message
            conversation.append({"role": "user", "parts": [message]})
            
            # Generate response
            response = self.model.generate_content(
                conversation,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=2048,
                    temperature=0.7,
                    top_p=0.8,
                    top_k=40,
                )
            )
            
            ai_response = response.text
            
            # Update history
            new_history = history + [(message, ai_response)]
            
            return ai_response, new_history
            
        except Exception as e:
            error_msg = f"I apologize, but I encountered an error: {str(e)}"
            if "API_KEY" in str(e).upper():
                error_msg = "Please ensure the GEMINI_API_KEY is properly configured in the Hugging Face Spaces secrets."
            
            new_history = history + [(message, error_msg)]
            return error_msg, new_history

    def reset_conversation(self) -> Tuple[str, List[Tuple[str, str]]]:
        """Reset the conversation history"""
        return "", []

# Initialize the AI instance
anvesh_ai = AnveshAI()

# Create Gradio interface
def create_interface():
    with gr.Blocks(
        title="AnveshAI - Intelligent Assistant",
        theme=gr.themes.Soft(),
        css="""
        .gradio-container {
            max-width: 800px !important;
            margin: auto !important;
        }
        .chat-message {
            padding: 10px;
            margin: 5px 0;
            border-radius: 10px;
        }
        .user-message {
            background-color: #e3f2fd;
            margin-left: 20px;
        }
        .ai-message {
            background-color: #f5f5f5;
            margin-right: 20px;
        }
        """
    ) as demo:
        
        # Header
        gr.Markdown(
            """
            # 🤖 AnveshAI - Intelligent Assistant
            
            Welcome to AnveshAI! I'm here to help you with programming, questions, problem-solving, and much more.
            Ask me anything and I'll do my best to provide helpful, detailed responses.
            """
        )
        
        # Chat interface
        with gr.Row():
            with gr.Column(scale=4):
                chatbot = gr.Chatbot(
                    value=[],
                    height=500,
                    show_label=False,
                    container=True,
                    bubble_full_width=False
                )
                
                with gr.Row():
                    msg_input = gr.Textbox(
                        placeholder="Type your message here...",
                        show_label=False,
                        scale=4,
                        container=False
                    )
                    send_btn = gr.Button("Send", variant="primary", scale=1)
                
                with gr.Row():
                    clear_btn = gr.Button("Clear Chat", variant="secondary")
                    
        # Instructions
        with gr.Accordion("💡 Tips for better conversations", open=False):
            gr.Markdown(
                """
                - **Be specific**: The more details you provide, the better I can help
                - **Ask follow-ups**: I remember our conversation, so feel free to build on previous topics
                - **Code help**: I can write, debug, and explain code in any programming language
                - **Complex topics**: Don't hesitate to ask about technical or complex subjects
                """
            )
        
        # Event handlers
        def handle_message(message, history):
            if not message.strip():
                return "", history
            ai_response, new_history = anvesh_ai.chat_response(message, history)
            return "", new_history  # Clear input, return updated history
        
        def clear_and_reset():
            empty_msg, empty_history = anvesh_ai.reset_conversation()
            return empty_msg, empty_history
        
        # Connect events
        msg_input.submit(
            handle_message,
            inputs=[msg_input, chatbot],
            outputs=[msg_input, chatbot]
        )
        
        send_btn.click(
            handle_message,
            inputs=[msg_input, chatbot], 
            outputs=[msg_input, chatbot]
        )
        
        clear_btn.click(
            clear_and_reset,
            outputs=[msg_input, chatbot]
        )
        
        # Footer
        gr.Markdown(
            """
            ---
            **Privacy Notice**: This app uses Google's Gemini API for AI responses. Your conversations are processed securely.
            
            **Powered by**: Google Gemini 2.5 Pro | **Built with**: Gradio & Hugging Face Spaces
            """
        )
    
    return demo

# Launch the app
if __name__ == "__main__":
    # Check if API key is available
    if not os.getenv("GEMINI_API_KEY"):
        print("⚠️  WARNING: GEMINI_API_KEY not found in environment variables.")
        print("Please set this secret in your Hugging Face Space settings.")
    
    demo = create_interface()
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False,
        show_error=True
    )