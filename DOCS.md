# RasoiGram - Production Architecture & Documentation

## 1. Product Architecture
RasoiGram is a full-stack AI-powered application designed for mobile-first usage.

### Frontend
- **Framework**: React 18+ with Vite (Transitionable to Flutter).
- **State Management**: React Context / Hooks + Firestore Real-time listeners.
- **Styling**: Tailwind CSS with a custom "Indian Premium" theme.
- **Animations**: Framer Motion (motion/react).

### Backend
- **Framework**: Node.js with Express (Server-side API proxy for Gemini).
- **Database**: Firebase Firestore (NoSQL, scalable).
- **Authentication**: Firebase Auth (Google Login).
- **AI Engine**: Google Gemini API (Flash for speed, Pro for complex recipes).
- **Storage**: Firebase Storage (for fridge/ingredient photos).

## 2. Database Schema (Firestore)

### Users Collection (`/users/{userId}`)
- `uid`: string (PK)
- `displayName`: string
- `email`: string
- `profileImage`: string
- `preferences`: {
    `cuisine`: string[],
    `dietaryRestrictions`: string[],
    `difficultyPreference`: string,
    `familySize`: number
  }
- `createdAt`: serverTimestamp
- `updatedAt`: serverTimestamp

### Ingredients Collection (`/users/{userId}/inventory/{ingredientId}`)
- `name`: string
- `category`: enum (vegetables, dairy, grains, etc.)
- `quantity`: string
- `expiryDate`: timestamp (optional)
- `addedAt`: serverTimestamp

### Meal Plans Collection (`/users/{userId}/mealPlans/{planId}`)
- `weekStarting`: timestamp
- `days`: {
    `monday`: { `breakfast`: RecipeRef, `lunch`: RecipeRef, `dinner`: RecipeRef, `snacks`: RecipeRef[] },
    ...
  }

### Recipes Cache (`/recipes/{recipeId}`)
- `title`: string
- `ingredients`: Array<{ name: string, amount: string }>
- `steps`: string[]
- `cuisine`: string
- `tags`: string[]
- `nutritionalInfo`: object
- `image`: string (AI generated or stock)

## 3. API Endpoints (Express)
- `GET /api/inventory`: Fetch user inventory.
- `POST /api/inventory/scan`: Process image via Gemini Vision to detect ingredients.
- `POST /api/recipes/generate`: AI call to generate recipe based on inventory.
- `POST /api/mealplan/generate`: AI call for weekly planning.
- `GET /api/grocery-list`: Calculate missing items.

## 4. MVP Roadmap
- **Phase 1**: Core UI & Auth + Manual Ingredient Input.
- **Phase 2**: AI Recipe Generation (Gemini 1.5 Flash).
- **Phase 3**: Image Recognition (Gemini Vision) for Fridge Scanning.
- **Phase 4**: Meal Planner & Grocery List Export.
- **Phase 5**: Family Profiles & Health Tracking.

## 5. Monetization Model
- **Freemium**: Basic recipe generation and inventory tracking.
- **Premium (RasoiGram+)**: 
  - Unlimited AI recipe variations.
  - Personalized Diet Intelligence (Diabetic, Keto, etc.).
  - Ad-free experience.
  - Priority support.
- **B2B Integration**: Commissions from grocery delivery partners (Zepto, Blinkit).

## 6. Deployment Architecture
- **Environment**: Cloud Run (Containerized).
- **CI/CD**: GitHub Actions.
- **Monitoring**: Mixpanel for analytics, Sentry for errors.
