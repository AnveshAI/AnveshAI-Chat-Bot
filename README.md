---
title: AnveshAI - Chat Bot Beta
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: gradio
sdk_version: 4.0.0
app_file: app.py
pinned: false
license: mit
---

# 🤖 AnveshAI - Chat Bot Beta

An advanced AI chat assistant powered by Google Gemini 2.5 Pro, designed to help with programming, problem-solving, and intelligent conversations.

## Features

- **Advanced AI Conversations**: Powered by Google Gemini 2.5 Pro for intelligent responses
- **Code Assistance**: Get help with programming in any language
- **Context Awareness**: Maintains conversation history for better interactions
- **Secure API Key Management**: Uses Hugging Face Spaces secrets for security
- **User-Friendly Interface**: Clean, modern chat interface built with Gradio

## 🚀 Quick Start

1. **Clone or Fork this Space**
2. **Set up API Key** (Critical - see security section below)
3. **Launch the Space**

## 🔐 Security Setup (IMPORTANT)

**⚠️ Your API key is never exposed in the code and must be set as a secret in Hugging Face Spaces.**

### Setting up your Gemini API Key:

1. **Get a Gemini API Key**:
   - Go to [Google AI Studio](https://aistudio.google.com/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key (starts with "AIza...")

2. **Add to Hugging Face Secrets**:
   - Go to your Space's Settings tab
   - Click "Repository secrets" 
   - Add a new secret:
     - **Name**: `GEMINI_API_KEY`
     - **Value**: Your API key (paste the full key)
   - Save the secret

3. **Restart your Space** after adding the secret

### ✅ Security Features:
- API key stored as encrypted secret in Hugging Face
- No API keys in source code
- Secure environment variable access
- Error messages don't expose sensitive information

## 💡 Usage Tips

- **Be Specific**: Provide detailed questions for better responses
- **Code Help**: Ask for code explanations, debugging, or writing assistance
- **Follow-up Questions**: The AI remembers conversation context
- **Complex Topics**: Don't hesitate to ask technical or complex questions

## 📋 Example Interactions

- "Explain async/await in JavaScript with examples"
- "Help me debug this Python function"
- "What's the difference between React hooks and class components?"
- "Write a sorting algorithm in Python"

## 🛠️ Technical Details

- **AI Model**: Google Gemini 2.5 Pro
- **Framework**: Gradio 4.0+
- **Python**: 3.8+
- **API**: Google Generative AI

## 📄 License

MIT License - Feel free to fork and customize!

## 🔧 Customization

You can customize the AI's behavior by modifying the system prompt in `app.py`. The interface styling can be adjusted through the CSS in the Gradio Blocks configuration.

## 🐛 Troubleshooting

**Common Issues:**

1. **"API Key Error"**: Ensure `GEMINI_API_KEY` is set in Space secrets
2. **"Model Error"**: Check your API key has proper permissions
3. **Slow Responses**: Gemini Pro may take a few seconds for complex queries

**Getting Help:**
- Check the Space logs for error details
- Verify your API key is correctly set
- Ensure you have Gemini API access

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/AnveshAI/AnveshAI-Chat-Bot-Beta/issues)
---

**Made with ❤️ by the AnveshAI team**
