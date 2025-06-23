# 👻 Ghost Notes

**Secure Self-Destructing Messages for Maximum Privacy**

Created by **Abhra** - A modern, secure platform for sharing sensitive information that automatically vanishes after being viewed once.

![Ghost Notes](https://img.shields.io/badge/Ghost%20Notes-v1.0-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![Security](https://img.shields.io/badge/Security-First-red?style=for-the-badge&logo=shield)

## ✨ Features

### 🔐 **Core Security**
- **One-time view** - Notes self-destruct after being read once
- **Auto-expiry** - Choose from 1 hour, 1 day, or 3 days
- **Memory-only storage** - Zero database persistence
- **Password protection** - Optional bcrypt-hashed passwords
- **Secure IDs** - 16-character cryptographically secure random IDs

### 📱 **Modern UX**
- **QR Code generation** - Easy mobile sharing
- **Note previews** - See first 50 characters before full reveal
- **Real-time statistics** - Track notes created, viewed, and expired
- **Dark theme** - Beautiful glass morphism design
- **Responsive design** - Works perfectly on all devices

### 🚀 **Advanced Features**
- **Copy to clipboard** - One-click sharing
- **Download QR codes** - Save as PNG files
- **Character counter** - Up to 10,000 characters
- **Real-time countdown** - See exactly when notes expire
- **Enhanced animations** - Smooth, professional interactions

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS + shadcn/ui components
- **Security**: bcrypt for password hashing
- **QR Codes**: qrcode library for generation
- **Icons**: Lucide React icons
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/abhrajyoti-01/ghost-notes.git
cd ghost-notes
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. **Run development server**
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. **Open your browser**
Navigate to `http://localhost:3000`

### Production Deployment

\`\`\`bash
npm run build
npm start
\`\`\`

## 📖 Usage Guide

### Creating a Ghost Note

1. **Write your message** - Enter up to 10,000 characters
2. **Set expiry time** - Choose 1 hour, 1 day, or 3 days
3. **Add password** (optional) - Extra layer of security
4. **Generate link** - Get a unique, one-time-use URL
5. **Share securely** - Via link or QR code

### Accessing a Ghost Note

1. **Click the link** - Or scan the QR code
2. **Enter password** (if required)
3. **View preview** (optional) - See first 50 characters
4. **Reveal note** - Permanently destroys the note
5. **Copy content** - Save to secure location if needed

## 🔒 Security Model

### ✅ What We Protect Against
- **Data persistence** - Notes never touch disk or database
- **Unauthorized access** - Password protection available
- **Link sharing** - Cryptographically secure IDs
- **Time-based attacks** - Automatic expiry
- **Brute force** - bcrypt password hashing

### ⚠️ Security Limitations
- **Server restarts** - Notes lost if server crashes
- **Network interception** - Use HTTPS and secure channels
- **Screenshot risk** - Recipients can capture content
- **Browser caching** - Temporary storage possible
- **No audit trail** - Zero logging for privacy

### 🛡️ Best Practices
- Use password protection for sensitive data
- Share links through encrypted messaging
- Choose shortest expiry time needed
- Verify recipient before sharing
- Use QR codes for in-person sharing

## 📊 API Reference

### Create Note
\`\`\`http
POST /api/notes
Content-Type: application/json

{
  "content": "Your secret message",
  "expiryHours": 1,
  "password": "optional-password"
}
\`\`\`
### Author
- **Abhra** - [GitHub](https://github.com/abhrajyoti-01)
