📘 CurricuForge – AI-Powered Curriculum Generator

CurricuForge is a modern AI-powered curriculum generation platform that helps users create structured learning paths, syllabi, and course outlines using Google Gemini AI.
Built with Vite + JavaScript (frontend) and designed for speed, simplicity, and scalability.

🚀 Features

🤖 AI Curriculum Generation using Gemini API

📚 Generate structured course modules & learning outcomes

⚡ Fast frontend powered by Vite

🎨 Clean & responsive UI

🔐 Secure API key handling using environment variables

🌐 Web-based platform (no installation needed for users)

🛠️ Tech Stack
Layer	Technology
Frontend	Vite, HTML, CSS, JavaScript
AI Model	Google Gemini API
Environment	Node.js
Version Control	Git & GitHub
📂 Project Structure
CurricuForge/
│
├── public/                # Static assets
├── src/
│   ├── components/        # UI components
│   ├── services/          # API integration
│   ├── styles/            # CSS files
│   └── main.js             # App entry point
│
├── .env                   # Environment variables (not committed)
├── .gitignore
├── index.html
├── package.json
└── README.md

🔑 Environment Setup (IMPORTANT)

Create a .env file in the root folder:

VITE_GEMINI_API_KEY=your_api_key_here


⚠️ Do NOT add semicolons
⚠️ Do NOT commit .env to GitHub

Make sure .env is added to .gitignore.

🧠 Using Gemini API in Vite
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;


Vite only exposes environment variables prefixed with VITE_.

▶️ How to Run the Project
1️⃣ Clone the repository
git clone https://github.com/your-username/CurricuForge.git

2️⃣ Navigate to project folder
cd CurricuForge

3️⃣ Install dependencies
npm install

4️⃣ Start development server
npm run dev


The app will run on:

http://localhost:5173

📦 Build for Production
npm run build


Output will be generated inside the dist/ folder.

🔐 Security Best Practices

❌ Never expose API keys in frontend code

❌ Never push .env files to GitHub

✅ Restrict Gemini API key in Google Cloud Console

✅ Use backend proxy (Flask / Node) for production apps

📌 Future Enhancements

🔐 User authentication

📄 PDF curriculum export

🧾 Save & manage generated curricula

🧠 Multi-model AI support

🌍 Cloud deployment

👨‍💻 Author

Shiva
📧 Email: shivadashmisthry26@gmail.com

⭐ Support

If you like this project, please ⭐ star the repository and share it!
