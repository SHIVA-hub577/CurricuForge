
# ⚒️ CurricuForge AI

CurricuForge is a high-performance, AI-powered curriculum generator designed to bridge the gap between academic theory and industry requirements. Using **Google Gemini AI**, it crafts highly structured, OBE-compliant (Outcome Based Education) learning pathways tailored to specific durations and target audiences.

## 🚀 Tech Stack

### Frontend
- **React 19**: Utilizing the latest React features for a responsive and performant UI.
- **TypeScript**: Ensuring type safety across the entire application domain.
- **Tailwind CSS**: For high-end, custom "Glassmorphism" aesthetics and dark-mode optimization.
- **Vite**: Modern frontend build tool for rapid development and optimized production bundles.

### AI Engine
- **Google Gemini API (@google/genai)**: Powering both the curriculum synthesis and the automated pedagogical assessment (Quiz) generation.
- **Prompt Engineering**: Custom system instructions to ensure industry alignment and OBE outcome mapping.

### Utilities
- **jsPDF & jsPDF-Autotable**: For high-quality document generation, allowing users to export their learning pathways to PDF.
- **LocalStorage API**: For persistent user sessions and curriculum history (forged archive).

## ✨ Key Features

- **Role-Based Access Control**:
  - **Teachers**: Can generate curricula, create pedagogical assessments (quizzes), and review student readiness goals.
  - **Students**: Can generate pathways and access curated learning resources (YouTube, articles, documentation) without seeing teacher-only assessments.
- **Structured Pathways**: Organizes learning into Periods (Days, Weeks, Months, Semesters) with specific Course Codes and Topics.
- **Integrated Learning Resources**: Every generated topic includes real-world resources (Videos, Blogs, Docs) to jumpstart the learning process.
- **Forged Archive**: A personal history of all generated curricula, allowing users to revisit and export any previous work.
- **Industry Mapping**: Automatically generates OBE outcomes, potential job roles, and capstone project ideas.

## 🛠️ Setup Instructions

1. **Clone the repository** and navigate to the project root.
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file and add your Gemini API Key:
   ```env
   VITE_GEMINI_API_KEY=your_google_ai_key_here
   ```
4. **Launch Development Server**:
   ```bash
   npm run dev
   ```

---
*Forged with 💎 and AI for the next generation of learners.*
