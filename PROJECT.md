# Highlight Translation App - Project Documentation

## Overview
A modern web application designed to enhance English language learning through interactive reading, intelligent translation, and spaced repetition flashcards. The app uses AI to provide context-aware explanations and personalized learning experiences.

## Project Structure

```
highlight-translation-app/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── chat/            # AI chat endpoint
│   │   ├── flashcards/      # Flashcard management
│   │   ├── reading-list/    # Reading list management
│   │   ├── translate/       # Translation service
│   │   └── preferences/     # User preferences
│   ├── components/          # React components
│   │   ├── Flashcard.tsx    # Flashcard component
│   │   ├── InteractiveReader.tsx  # Main reading interface
│   │   ├── Navbar.tsx       # Navigation component
│   │   └── TranslationPopup.tsx   # Translation popup
│   ├── contexts/            # React contexts
│   │   ├── SettingsContext.tsx    # App settings
│   │   └── LearningSettingsContext.tsx  # Learning preferences
│   ├── types/               # TypeScript types
│   │   ├── flashcard.ts     # Flashcard types
│   │   └── translation.ts   # Translation types
│   └── utils/               # Utility functions
│       ├── textProcessing.ts    # Text analysis
│       └── flashcardManager.ts  # Flashcard operations
├── prisma/                  # Database schema
│   └── schema.prisma        # Prisma schema definition
└── public/                  # Static assets
```

## Key Features

### 1. Interactive Reader
- **Text Selection**: Users can select any word or phrase for instant analysis
- **Context-Aware Translation**: AI provides explanations based on surrounding context
- **Customizable Learning Levels**: Adjustable hint and detail levels for personalized learning
- **Reading List Integration**: Save interesting passages for later review

### 2. Flashcard System
- **Spaced Repetition**: Smart review scheduling based on mastery levels
- **Mastery Tracking**: Visual progress indicators and statistics
- **Review History**: Track performance and learning patterns
- **Duplicate Prevention**: Automatic checks for existing flashcards

### 3. AI-Powered Learning
- **Contextual Analysis**: AI understands and explains words in context
- **Adaptive Difficulty**: Adjusts explanations based on user settings
- **Comprehensive Explanations**: Includes examples, grammar notes, and usage tips
- **Progress Tracking**: Monitors learning patterns and suggests improvements

## Key Code Components

### 1. Translation System
```typescript
// app/api/translate/route.ts
export async function POST(request: Request) {
  const { text, context, hintLevel, translationDetail } = await request.json();
  
  // Normalize levels to 1-5 scale
  const normalizedHintLevel = Math.max(1, Math.min(5, Math.round(Number(hintLevel))));
  const normalizedDetailLevel = Math.max(1, Math.min(5, Math.round(Number(translationDetail))));

  // Generate AI response based on levels
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an English language learning assistant...`
      }
    ]
  });
}
```

### 2. Flashcard Management
```typescript
// app/api/flashcards/route.ts
export async function POST(request: Request) {
  const { word, userId, translations } = await request.json();
  
  // Create new flashcard
  const flashcard = await prisma.flashcard.create({
    data: {
      word,
      userId,
      translations: {
        create: translations
      },
      masteryLevel: 0,
      reviewCount: 0,
      status: 'active'
    }
  });
}
```

### 3. Interactive Reader Component
```typescript
// app/components/InteractiveReader.tsx
export default function InteractiveReader({ title, content }: InteractiveReaderProps) {
  const { settings } = useSettings();
  
  const handleTextSelection = useCallback(async () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    
    if (text) {
      const translationOptions = {
        hintLevel: Math.max(1, Math.min(5, Math.ceil(settings.hintLevel / 20))),
        translationDetail: Math.max(1, Math.min(5, Math.ceil(settings.translationDetail / 20))),
        sourceLang: 'English',
        targetLang: 'English'
      };
      
      const translationResult = await getContextAwareTranslation(
        text,
        content,
        position,
        translationOptions
      );
    }
  }, [content, settings]);
}
```

## Database Schema

```prisma
// prisma/schema.prisma
model Flashcard {
  id              String   @id @default(cuid())
  word            String
  userId          String
  translations    Translation[]
  masteryLevel    Int      @default(0)
  reviewCount     Int      @default(0)
  correctStreak   Int      @default(0)
  lastReviewed    DateTime?
  nextReview      DateTime?
  dateAdded       DateTime @default(now())
  status          String   @default("active")
}

model Translation {
  id          String   @id @default(cuid())
  text        String
  language    String
  flashcard   Flashcard @relation(fields: [flashcardId], references: [id])
  flashcardId String
}
```

## Learning Settings

### Hint Levels (1-5)
1. Very indirect hints (etymology, relationships)
2. Contextual clues and synonyms
3. Clear but concise explanation
4. Detailed explanation with nuances
5. Comprehensive explanation

### Detail Levels (1-5)
1. Basic meaning only
2. Common examples included
3. Related vocabulary added
4. Grammar patterns included
5. Full analysis with collocations

## API Endpoints

1. `/api/translate`
   - POST: Get AI-powered translation and explanation
   - Parameters: text, context, hintLevel, translationDetail

2. `/api/flashcards`
   - GET: Fetch user's flashcards
   - POST: Create new flashcard
   - PUT: Update flashcard
   - DELETE: Remove flashcard

3. `/api/flashcards/review`
   - POST: Record flashcard review results
   - Parameters: flashcardId, result (correct/incorrect/hint)

4. `/api/reading-list`
   - GET: Fetch reading list items
   - POST: Add new item
   - PUT: Update item
   - DELETE: Remove item

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Add your OpenAI API key to `.env.local`
5. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
6. Run the development server:
   ```bash
   npm run dev
   ```

## Future Enhancements

1. User Authentication
2. Progress Analytics Dashboard
3. Custom Learning Paths
4. Social Features (sharing, community)
5. Mobile App Version
6. Offline Support
7. Gamification Elements
8. Advanced AI Features
   - Personalized learning recommendations
   - Natural language practice
   - Pronunciation feedback

## License

MIT License - See LICENSE file for details 