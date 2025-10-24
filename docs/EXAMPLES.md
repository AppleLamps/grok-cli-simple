# LampCode Examples

Real-world examples of using LampCode to solve common coding tasks.

## Example 1: Finding and Fixing a Bug

**Scenario:** You have a bug in your authentication code but aren't sure where it is.

```bash
lamp> search authentication

# Results show auth-related code in multiple files

lamp> read lib/auth.js

# Review the file

lamp> I'm getting "token is undefined" in my authentication. Can you help?

# AI analyzes and suggests fixes

lamp> edit lib/auth.js
Instructions: Add null check for token before using it

# AI suggests the fix, you review and apply
```

---

## Example 2: Adding a New Feature

**Scenario:** Need to add input validation to a form.

```bash
lamp> read components/ContactForm.jsx

lamp> edit components/ContactForm.jsx
Instructions: Add email and phone number validation with helpful error messages

# Review AI suggestions

lamp> Apply? y

lamp> edit utils/validators.js
Instructions: Create reusable validation functions for email and phone

# Build supporting utilities
```

---

## Example 3: Code Refactoring

**Scenario:** Clean up repetitive code.

```bash
lamp> search "fetch("

# Find all fetch calls

lamp> The code has repetitive fetch calls. How can I refactor this?

# AI suggests creating a reusable API client

lamp> edit lib/apiClient.js
Instructions: Create an API client class with get, post, put, delete methods

lamp> edit services/userService.js
Instructions: Refactor to use the new apiClient instead of direct fetch calls
```

---

## Example 4: Understanding Legacy Code

**Scenario:** Working with unfamiliar code.

```bash
lamp> What does this project do?

# AI explains based on project files

lamp> read index.js

lamp> Explain how the application starts up

lamp> search "database"

# Find database-related code

lamp> How is the database connection handled?
```

---

## Example 5: Creating New Files

**Scenario:** Need to add a new feature module.

```bash
lamp> edit services/paymentService.js
Instructions: Create a payment service that integrates with Stripe. Include methods for processing payments, refunds, and getting payment history.

# Review and apply

lamp> edit tests/paymentService.test.js
Instructions: Create unit tests for paymentService covering success cases and error handling

# Add tests

lamp> edit types/payment.ts
Instructions: Create TypeScript types for payment-related data structures
```

---

## Example 6: Documentation

**Scenario:** Need to document your API.

```bash
lamp> read api/routes.js

lamp> edit docs/API.md
Instructions: Create API documentation for all routes in api/routes.js. Include endpoints, methods, request/response formats, and example usage.

# Generate comprehensive docs

lamp> edit README.md
Instructions: Add a quickstart guide showing how to run the project and make your first API call
```

---

## Example 7: Performance Optimization

**Scenario:** Application is slow.

```bash
lamp> What could be causing performance issues in this React app?

# AI analyzes project files

lamp> search "useEffect"

# Check for problematic effects

lamp> edit components/Dashboard.jsx
Instructions: Memoize expensive calculations using useMemo and prevent unnecessary re-renders with React.memo

lamp> The list is slow with 1000 items. How can I fix this?

# AI suggests virtualization

lamp> edit components/ItemList.jsx
Instructions: Implement virtual scrolling for the list using react-window
```

---

## Example 8: Security Audit

**Scenario:** Check for security issues.

```bash
lamp> Are there any security vulnerabilities in this code?

lamp> search "password"

# Find password-related code

lamp> The password is stored in plain text. How should I fix this?

lamp> edit lib/auth.js
Instructions: Use bcrypt to hash passwords before storing them and compare hashed passwords during login

lamp> search "eval("

# Check for dangerous eval usage

lamp> Replace eval usage with safer alternatives
```

---

## Example 9: Database Migration

**Scenario:** Need to update database schema.

```bash
lamp> read database/schema.sql

lamp> edit migrations/add-user-preferences.sql
Instructions: Create a migration to add a user_preferences table with columns for user_id, theme, language, and notifications

lamp> edit models/User.js
Instructions: Add methods to get and update user preferences

lamp> edit api/preferences.js
Instructions: Create API routes for getting and updating user preferences
```

---

## Example 10: Test Coverage

**Scenario:** Need to add tests.

```bash
lamp> search "function"

# See all functions

lamp> edit tests/utils.test.js
Instructions: Create comprehensive tests for all functions in utils.js covering edge cases and error conditions

lamp> What's not covered by tests?

lamp> edit tests/integration.test.js
Instructions: Create integration tests for the user registration and login flow
```

---

## Tips for Maximum Productivity

1. **Start with Search**: Find what you need before editing
2. **Read First**: Understand code before modifying it
3. **Small Changes**: Multiple small edits are easier to review than one large change
4. **Ask Questions**: Don't guess - ask the AI to explain first
5. **Chain Commands**: Use output from one command to inform the next
6. **Verify Changes**: Always review AI suggestions before applying
7. **Iterate**: If results aren't perfect, try again with more specific instructions
