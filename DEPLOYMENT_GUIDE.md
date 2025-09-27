# 🚀 Hugging Face Spaces Deployment Guide

This guide will help you deploy your AnveshAI application to Hugging Face Spaces while keeping your API key completely secure.

## 📋 Files Ready for Deployment

- `app.py` - Main Gradio application
- `requirements.txt` - Python dependencies for Hugging Face Spaces
- `README.md` - Hugging Face Space documentation and metadata
- `DEPLOYMENT_GUIDE.md` - This deployment guide

## 🔐 Security-First Deployment Steps

### Step 1: Create New Hugging Face Space

1. Go to [Hugging Face Spaces](https://huggingface.co/spaces)
2. Click "Create new Space"
3. Choose:
   - **Space name**: `anvesh-ai` (or your preferred name)
   - **License**: MIT
   - **SDK**: Gradio
   - **Private/Public**: Your choice
4. Click "Create Space"

### Step 2: Secure API Key Setup ⚠️ CRITICAL

**NEVER** commit your API key to the repository!

1. **In your Hugging Face Space**:
   - Go to Settings tab
   - Click "Repository secrets"
   - Add new secret:
     - **Name**: `GEMINI_API_KEY`
     - **Value**: [Your actual Gemini API key]
   - Save the secret

2. **Verify Security**:
   - Your API key is now encrypted and stored securely
   - It will be available as `os.getenv("GEMINI_API_KEY")` in your app
   - It will NEVER appear in logs or source code

### Step 3: Upload Files

1. **Upload these files to your Space**:
   ```
   app.py                    # Main application
   requirements.txt          # Python dependencies
   README.md                 # Space documentation
   ```

2. **File structure should look like**:
   ```
   your-space/
   ├── app.py
   ├── requirements.txt
   └── README.md
   ```

### Step 4: Deploy and Test

1. **Commit files** to your Space repository
2. **Wait for build** (usually 2-3 minutes)
3. **Test the app**:
   - Try a simple message: "Hello, how are you?"
   - Test code assistance: "Explain Python loops"
   - Verify responses are intelligent (not basic templates)

## 🔍 Verification Checklist

✅ **Security Verified**:
- [ ] API key set as secret in HF Spaces
- [ ] No API key visible in source code
- [ ] `.gitignore` includes API key patterns
- [ ] App shows proper error if key missing

✅ **Functionality Verified**:
- [ ] Chat interface loads properly
- [ ] AI responses are intelligent (Gemini Pro quality)
- [ ] Conversation history works
- [ ] Clear chat function works
- [ ] Error handling works gracefully

## 🎨 Customization Options

After successful deployment, you can customize:

### 1. Branding
```python
# In app.py, modify the header
gr.Markdown("# 🤖 Your Custom AI Name")
```

### 2. AI Personality
```python
# Modify the system prompt in get_system_prompt()
def get_system_prompt(self) -> str:
    return "You are [Your Custom AI Personality]..."
```

### 3. Interface Styling
```python
# Modify the CSS in create_interface()
css = """
.gradio-container {
    /* Your custom styles */
}
"""
```

## 🐛 Troubleshooting

### Common Issues:

**1. "API Key Error"**
- Solution: Verify `GEMINI_API_KEY` is set in Space secrets
- Check: Settings > Repository secrets

**2. "Import Error"**
- Solution: Verify `requirements.txt` includes all dependencies
- Check: Build logs in your Space

**3. "Model Access Error"**
- Solution: Ensure your Google account has Gemini API access
- Check: Visit [Google AI Studio](https://aistudio.google.com)

**4. Slow Responses**
- Normal: Gemini Pro responses may take 3-10 seconds
- Monitor: Check if responses eventually come through

### Debug Steps:
1. Check Space build logs
2. Verify secrets are set correctly
3. Test API key in Google AI Studio
4. Review error messages in Space logs

## 🔄 Updating Your Deployment

To update your deployed app:
1. Modify files locally
2. Upload to your Space repository
3. Space will automatically rebuild
4. Test new functionality

## 📞 Support

If you encounter issues:
- Check Hugging Face Spaces documentation
- Verify Google Gemini API status
- Review Space build logs
- Ensure all secrets are correctly set

---

**🎉 Congratulations!** Your AnveshAI is now securely deployed on Hugging Face Spaces with your API key protected!