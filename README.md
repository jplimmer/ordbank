# <img src="public/icon.png" alt="Logo" width="36" style="border-radius: 50%; vertical-align: top; margin-right: 8px"> OrdBank

![Development Status](https://img.shields.io/badge/Status-Development-yellow)

A vocabulary learning application built with **Next.js** and **Drizzle ORM**.

Currently in development, this app will allow language learners to test themselves on the vocabulary they find most challenging.

### Features

- **Vocabulary Management:** add, edit and delete vocabulary entries with source language terms and translations
- **Interactive testing:** Multiple testing modes, including typing and multiple choice (Planned)
- **Flexible Practice:** Set time limits, question counts or unlimited practice sessions (Planned)
- **Adaptive Learning:** Words you struggle with most feature more heavily in tests (Planned)

## Tech stack

- **Framework:** Next.js 15 with TypeScript
- **Database:** SQLite with Drizzle ORM
- **Styling:** Tailwind CSS 4, Lucide React
- **Development:** ESLint, Prettier, Turbopack

## Pre-requisites

- Node.js (version 20 or higher recommended)
- **npm** or **yarn** package manager

## Getting started

1. Clone the repository:

   ```bash
   git clone https://github.com/jplimmer/ordbank.git
   cd ordbank
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
ordbank/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # Reusable React components
│   ├── db/            # Database schema and configuration
│   ├── lib/           # Shared
│   └── utils/         # Utility functions and helpers
├── public/            # Static assets
├── drizzle/           # Database migrations
└── README.md          # This file
```

## Contributing

This is currently a personal project, but I'm open to contributions! If you'd like to contribute:

1. Fork the repository.

2. Create a feature branch:

   ```bash
   git checkout -b feature/my-new-feature
   ```

3. Make your changes and commit them:

   ```bash
   git add .
   git commit -m "Add my new feature"
   ```

4. Push your changes to your forked repository:

   ```bash
   git push origin feature/my-new-feature
   ```

5. Open a pull request from your fork to the main repository.

## License

This project is private and not currently licensed for public use.
