# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/f8defb20-7861-4bad-8c21-43e688789843

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f8defb20-7861-4bad-8c21-43e688789843) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Set up environment variables
# Create a .env file and add your Gemini API key
echo "VITE_GEMINI_API_KEY=your_actual_api_key_here" > .env

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## 🔑 API Configuration

This project uses Google's Gemini API for food image analysis. To get started:

1. **Get a Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API key"
   - Copy your API key

2. **Configure the API Key**:
   - Create a `.env` file in the project root
   - Add: `VITE_GEMINI_API_KEY=your_actual_api_key_here`
   - Replace `your_actual_api_key_here` with your actual API key

3. **Features**:
   - Real-time camera capture for food images
   - AI-powered nutritional analysis using Gemini Vision
   - Detailed nutrition labels with calories, macros, and micronutrients
   - Fallback mock data when API is not configured

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f8defb20-7861-4bad-8c21-43e688789843) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
