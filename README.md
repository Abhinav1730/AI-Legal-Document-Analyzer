# 🏛️ LegalAI - Legal Document Analyzer

A powerful AI-powered legal document analysis platform that extracts and analyzes legal clauses from contracts, agreements, and legal documents using Google Gemini AI. Built with modern web technologies and featuring multi-language support.

![LegalAI Logo](https://img.shields.io/badge/LegalAI-Legal%20Document%20Analyzer-gold?style=for-the-badge&logo=scale)
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)

## 🌟 Features

### 🤖 AI-Powered Analysis
- **Google Gemini 2.5 Flash Integration** - Advanced AI for legal clause extraction
- **Intelligent Text Processing** - Handles PDF, DOCX, and image documents
- **Comprehensive Legal Categories** - 10+ legal clause types with subcategories
- **Confidence Scoring** - AI confidence levels for each extracted clause
- **Fallback Analysis** - Keyword-based analysis when AI fails

### 📄 Document Management
- **Multi-Format Support** - PDF, DOCX, and image files
- **Drag & Drop Upload** - Intuitive file upload interface
- **Document Storage** - Secure cloud storage with MongoDB
- **Document Preview** - View full document content
- **Analysis History** - Track all analyzed documents

### 🔐 Authentication & Security
- **Dual Authentication** - JWT tokens and Google OAuth 2.0
- **Session Management** - 10-minute inactivity timeout
- **Persistent Login** - Local storage with automatic session renewal
- **Secure File Handling** - Protected document access

### 🌍 Multi-Language Support
- **11 Languages** - English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Punjabi, Kannada, Malayalam, Odia
- **Real-time Translation** - Dynamic language switching
- **Localized UI** - Complete interface translation

### 🎨 Modern UI/UX
- **Dark Theme** - Professional dark mode interface
- **Responsive Design** - Mobile-first responsive layout
- **Interactive Components** - Smooth animations with Framer Motion
- **Document Dropdown** - Quick access to all documents in navbar
- **Analysis Summary** - Dashboard with document statistics

## 🚀 Tech Stack

### Frontend
- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React i18next** - Internationalization
- **Lucide React** - Icon library
- **React Dropzone** - File upload handling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Passport.js** - Authentication middleware
- **Google Gemini AI** - AI analysis engine
- **Multer** - File upload handling
- **JWT** - JSON Web Tokens

### AI & Document Processing
- **Google Gemini 2.5 Flash** - Primary AI analysis
- **PDF Parse** - PDF text extraction
- **Mammoth** - DOCX text extraction
- **Tesseract.js** - OCR for image documents

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- Google Gemini API key
- Google OAuth credentials (optional)

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/legal-document-analyzer.git
cd legal-document-analyzer
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/legalyzer

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:3000

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env.local` file in frontend directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### 4. Start Development Servers

Backend (Terminal 1):
```bash
cd backend
npm run dev
```

Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```

## 🔧 Configuration

### Google Gemini API Setup

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Add the key to your backend `.env` file

### Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://your-domain.com/api/auth/google/callback` (production)

## 🚀 Deployment

### Vercel Deployment (Frontend)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel:
   - `NEXT_PUBLIC_API_BASE_URL` = `https://your-backend-domain.com`
4. Deploy

### Backend Deployment

Deploy to your preferred platform (Vercel, Railway, Heroku, etc.) and update the frontend's `NEXT_PUBLIC_API_BASE_URL`.

## 📖 Usage

### 1. Authentication
- **Register/Login** with email and password
- **Google OAuth** for quick sign-in
- **Session Management** with automatic timeout

### 2. Document Upload
- **Drag & Drop** files onto the upload area
- **Supported Formats** - PDF, DOCX, Images
- **Upload Feedback** - Real-time upload status

### 3. Document Analysis
- **Click "Analyze"** on any uploaded document
- **AI Processing** - Google Gemini extracts legal clauses
- **Results Display** - Categorized clauses with confidence scores
- **Document Preview** - View full document content

### 4. Document Management
- **Document List** - View all uploaded documents
- **Analysis Status** - Track which documents are analyzed
- **Quick Access** - Document dropdown in navbar
- **Delete Documents** - Remove unwanted files

## 🔍 Legal Categories Analyzed

1. **Termination & Expiry** - Contract termination clauses
2. **Payment Terms** - Payment schedules and methods
3. **Liability & Indemnification** - Risk allocation clauses
4. **Confidentiality** - Non-disclosure provisions
5. **Governing Law** - Jurisdiction and legal framework
6. **Dispute Resolution** - Arbitration and litigation clauses
7. **Intellectual Property** - IP rights and ownership
8. **Force Majeure** - Unforeseen circumstances
9. **Warranties** - Guarantees and representations
10. **Compliance** - Regulatory requirements

## 🌐 Supported Languages

- English (en)
- Hindi (hi)
- Tamil (ta)
- Telugu (te)
- Bengali (bn)
- Marathi (mr)
- Gujarati (gu)
- Punjabi (pa)
- Kannada (kn)
- Malayalam (ml)
- Odia (or)

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Documents
- `POST /api/docs/upload` - Upload document
- `GET /api/docs` - List user documents
- `GET /api/docs/:id` - Get specific document
- `POST /api/docs/:id/reanalyze` - Re-analyze document
- `DELETE /api/docs/:id` - Delete document

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based auth
- **Session Management** - Automatic timeout handling
- **File Validation** - Secure file upload processing
- **CORS Protection** - Cross-origin request security
- **Input Sanitization** - XSS protection
- **Rate Limiting** - API abuse prevention

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm run lint
```

## 📈 Performance Optimizations

- **Memory Management** - Optimized for large documents
- **Chunked Processing** - Efficient text processing
- **Lazy Loading** - On-demand component loading
- **Image Optimization** - Next.js image optimization
- **Caching** - API response caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abhinav Saxena**
- GitHub: [@abhinavsaxena](https://github.com/abhinavsaxena)
- LinkedIn: [Abhinav Saxena](https://linkedin.com/in/abhinavsaxena)
- Email: abhinav.saxena1730@gmail.com

## 🙏 Acknowledgments

- Google Gemini AI for powerful document analysis
- Next.js team for the amazing framework
- MongoDB for reliable data storage
- All open-source contributors

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/legal-document-analyzer/issues) page
2. Create a new issue with detailed description
3. Contact the author directly

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Abhinav Saxena](https://github.com/abhinavsaxena)

</div>
