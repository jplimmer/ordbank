import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function UserGuide() {
  return (
    <div className="container mx-auto px-4 py-8 text-primary text-pretty">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">User Guide</h1>
        <p className="text-muted-foreground">
          Welcome! Ordbank helps you build and test your vocabulary across any
          language pair you&apos;re learning. Create your own word lists, then
          test yourself whenever you have a few minutes.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="navigation">
          <AccordionTrigger>Navigation</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Footer Menu</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  The footer at the bottom of the screen gives you quick access
                  to:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-2">
                  <li>
                    <strong>Account</strong>: Access your languages, account
                    settings, and sign out
                  </li>
                  <li>
                    <strong>Vocabulary/Home</strong>: Switch between your
                    vocabulary list and home page
                  </li>
                  <li>
                    <strong>User Guide</strong>: Return to this guide anytime
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Language Selector</h3>
                <p className="text-sm text-muted-foreground">
                  Use the dropdown in the top left corner to quickly switch
                  between your language pairs without visiting the Languages
                  page.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Theme Toggle</h3>
                <p className="text-sm text-muted-foreground">
                  The button in the top right corner lets you switch between
                  light, dark, and system themes.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="getting-started">
          <AccordionTrigger>Getting Started</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Sign In</h3>
                <p className="text-sm text-muted-foreground">
                  Create an account or sign in to get started. Your vocabulary
                  lists and progress are saved automatically.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  2. Create Your First Language Pair
                </h3>
                <p className="text-sm text-muted-foreground">
                  Go to <strong>Languages</strong> to set up your first language
                  pair (for example, Swedish-English or Italian-French). You can
                  create as many pairs as you like and switch between them
                  anytime.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  The language pair you&apos;re currently working with is your
                  &quot;active&quot; pair—this determines which vocabulary you
                  see and test.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Add Some Words</h3>
                <p className="text-sm text-muted-foreground">
                  Head to <strong>Vocabulary</strong> to start building your
                  word list. Add words in your source language along with their
                  translations. Start with 10-15 words before taking your first
                  test.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  You can edit or delete words anytime as your list grows.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. Test Yourself</h3>
                <p className="text-sm text-muted-foreground">
                  When you&apos;re ready, go to <strong>Test</strong> and choose
                  your preferences:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1 ml-2">
                  <li>
                    <strong>Direction</strong>: Translate from source to target
                    language, target to source, or random
                  </li>
                  <li>
                    <strong>Answer type</strong>: Multiple choice (3 options),
                    typed answers, or random
                  </li>
                  <li>
                    <strong>Limits</strong>: Optionally set a question limit or
                    time limit
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-2">
                  The app automatically focuses on words you find more
                  challenging, so you&apos;ll practice what you need most.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="quick-access">
          <AccordionTrigger>Quick Access from Home</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground mb-3">
              Once signed in, the home page gives you two shortcuts for quick
              access on the go:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-2">
              <li>
                <strong>Add Word</strong>: Jump straight to adding a new word to
                your active language pair
              </li>
              <li>
                <strong>Test</strong>: Start a vocabulary test immediately
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              This makes it easy to squeeze in practice whenever you have a
              spare moment.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="managing-languages">
          <AccordionTrigger>Managing Your Languages</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground mb-3">
              In the <strong>Languages</strong> page, you can:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-2">
              <li>
                Create new language pairs for different languages you&apos;re
                learning
              </li>
              <li>Switch your active pair to work on a different language</li>
              <li>Edit language pair names</li>
              <li>Delete pairs you no longer need</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              Your active language pair stays selected even after you close the
              app.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="building-vocabulary">
          <AccordionTrigger>Building Your Vocabulary</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground mb-3">
              The <strong>Vocabulary</strong> page shows all words for your
              active language pair. Here you can:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-2">
              <li>Add new words with their translations</li>
              <li>Edit existing entries</li>
              <li>Remove words you no longer want to practice</li>
              <li>See your complete word list at a glance</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              Keep your lists focused on words you actually want to
              learn—quality over quantity.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="testing-features">
          <AccordionTrigger>Testing Features</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  When you take a test:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-2 mt-2">
                  <li>
                    Questions are selected randomly, with words you struggle
                    with appearing more often
                  </li>
                  <li>You&apos;ll see your score at the end of each test</li>
                  <li>
                    Your performance on every word is tracked to improve future
                    tests
                  </li>
                </ul>
              </div>

              <div className="mt-8 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">
                  Tips for Effective Practice
                </h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2 ml-2">
                  <li>
                    Try testing in both directions—translating both ways
                    reinforces your learning
                  </li>
                  <li>Use typed answers when you want a real challenge</li>
                  <li>
                    Multiple choice is great for recognition practice and quick
                    sessions
                  </li>
                  <li>
                    Short, regular practice sessions often work better than
                    occasional long ones
                  </li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
