# AIReader+

An AI-powered reading assistant for language learners.

## Features

### Core Features
- Interactive text reader with real-time translation
- Flashcard system with spaced repetition
- AI-powered language assistance
- Customizable learning settings

### Translation System
- Context-aware translations
- Multiple translation levels (basic, detailed, technical)
- Example sentences and usage notes
- Vocabulary and grammar suggestions
- Memory tips for better retention

### Flashcard System
- Automatic flashcard creation from selected text
- Mastery tracking with spaced repetition
- Review scheduling based on performance
- Visual progress indicators
- Detailed statistics and history

## Project Structure

```
highlight-translation-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── article/           # Article pages
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── flashcards/        # Flashcard pages
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Shared libraries
│   ├── settings/          # Settings pages
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── template.tsx       # Template component
│   └── metadata.ts        # Metadata configuration
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── src/                   # Source files
├── utils/                 # Utility functions
├── lib/                   # Shared libraries
├── .next/                 # Next.js build output
├── .swc/                  # SWC compiler cache
├── node_modules/          # Dependencies
├── .env.example           # Example environment variables
├── .env.local            # Local environment variables
├── .gitignore            # Git ignore rules
├── jest.config.js        # Jest configuration
├── jest.setup.js         # Jest setup
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
├── package-lock.json     # Locked dependencies
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tailwind.config.ts    # Tailwind CSS TypeScript configuration
└── tsconfig.json         # TypeScript configuration
```

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI API

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Update the following variables in `.env.local`:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `DATABASE_URL`: Your PostgreSQL database URL
   - `NEXTAUTH_SECRET`: Secret for NextAuth.js
   - `NEXTAUTH_URL`: Your application URL

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Development

### Key Components

1. **InteractiveReader**: Main component for text reading and translation
2. **TranslationPopup**: Displays translations and flashcard options
3. **FlashcardSystem**: Manages flashcard creation and review

### API Endpoints

- `/api/translate`: Text translation
- `/api/flashcards`: Flashcard management
- `/api/chat`: AI language assistance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 