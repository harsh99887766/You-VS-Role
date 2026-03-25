# 🎯 Skill Radar

**AI-powered resume-to-job matching that reveals your true potential**

Skill Radar analyzes how well your resume matches a job description and gives you detailed insights into your strengths, gaps, and hidden potential. No more wondering if you're "qualified enough" — let AI tell you exactly where you stand.

## ✨ What It Does

Upload a job description and your resume (as a PDF), and Skill Radar will:
- 🎲 **Calculate your match score** — See at a glance how well you fit the role
- 📊 **Build your skill radar** — Visualize required skills vs. your current level
- ⚠️ **Identify critical gaps** — Know exactly what you're missing
- 💪 **Highlight your strengths** — Discover what makes you valuable
- 🔍 **Uncover hidden talents** — Find skills you didn't realize you had
- 🚨 **Flag inconsistencies** — Catch resume red flags before an interview

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn
- A Google Generative AI API key ([Get one free here](https://makersuite.google.com/app/apikey))

### Installation

**Backend Setup:**
```bash
cd backend
npm install
echo "GEMINI_API_KEY=your_api_key_here" > .env
npm start
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

The app will open at `http://localhost:5173`

## 📋 How to Use

1. **Enter the job description** — Copy-paste the full JD into the text field
2. **Upload your resume** — Select your PDF file (currently supports PDF)
3. **Click analyze** — Let AI work its magic
4. **Review your results** — Check your match score, skill gaps, and personalized insights

## 🛠 Tech Stack

**Backend:**
- Express.js (TypeScript)
- MongoDB with Mongoose
- Google Generative AI (Gemini API)
- PDF parsing support

**Frontend:**
- React 18 with TypeScript
- Vite for lightning-fast builds
- Tailwind CSS for styling
- Recharts for beautiful visualizations
- Lucide icons for clean UI

## 📁 Project Structure

```
.
├── backend/              # Express server + AI analysis logic
│   ├── config/          # Database & environment config
│   ├── controllers/      # API endpoints
│   ├── models/          # MongoDB schemas
│   └── routes/          # Route definitions
└── frontend/            # React application
    ├── src/
    │   ├── components/  # UploadForm & ResultsDashboard
    │   └── assets/      # Images & icons
    └── vite.config.ts   # Vite configuration
```

## 🎨 Features Explained

### Match Score
A percentage showing how well your overall experience aligns with the job requirements (0-100).

### Skill Radar Chart
Visual comparison of required skill levels vs. your demonstrated levels—identify gaps at a glance.

### Growth Potential
An assessment of how easily you could grow into this role based on your existing foundation.

### Risk Analysis
- **Critical Gaps** — Must-have skills you're missing
- **Inconsistencies** — Conflicts in your resume that could hurt credibility
- **Overall Risk** — Low/Medium/High assessment of your fit

### Strengths & Weaknesses
Categorized skills showing what you excel at and where you need improvement.

### Hidden Strengths
AI-detected skills from your resume that you may not have explicitly mentioned but are valuable for the role.

## ⚙️ Configuration

Set these environment variables in `.env` (backend):
```
GEMINI_API_KEY=your_api_key_here
MONGODB_URI=mongodb://localhost:27017/skill_radar
PORT=5000
```

## 🤝 Contributing

Found a bug? Have a feature idea? We'd love your input!

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🙋 Support

Have questions? Check our [GitHub issues](https://github.com/harsh99887766/You-VS-Role/issues) or feel free to reach out!

---

**Pro Tip:** Use Skill Radar before applying for jobs to strategically position your resume and focus your upskilling efforts. 🎯
