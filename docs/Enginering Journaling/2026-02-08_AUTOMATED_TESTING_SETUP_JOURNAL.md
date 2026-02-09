# Engineering Journal: Automated Testing Setup

This journal documents the journey, architectural decisions, and technical challenges encountered while setting up the automated testing environment for the BMT NU Lumajang website.

## 1. Objective
Enable **Automated Testing** to catch regressions early, ensure code quality, and provide a safety net for future development, particularly for critical flows like currency formatting and contact form submissions.

## 2. Technology Stack
- **Jest**: The core test runner. Chosen for its zero-config philosophy with Next.js (`next/jest`) and fast parallel execution.
- **React Testing Library (RTL)**: Testing utilities that encourage testing *behavior* (how users interact: verify button click, verify text appears) rather than *implementation details* (checking state variable "x").
- **JSDOM**: A lightweight browser simulation that runs in Node.js, allowing us to test React components without a real browser.

## 3. Architecture & Configuration

### A. The Brain: `jest.config.js`
Initially, we attempted to use TypeScript (`jest.config.ts`), but encountered module resolution issues on Windows. We refactored to CommonJS (`jest.config.js`) for stability.
- **`testEnvironment: 'jsdom'`**: Simulates the DOM API (document, window).
- **`moduleNameMapper`**: Maps `@/components` to local paths so imports works.

### B. The Environment: `jest.setup.js`
Extends Jest with custom matchers from `@testing-library/jest-dom`, enabling readable assertions like:
```javascript
expect(element).toBeInTheDocument();
expect(button).toBeDisabled();
```
We faced an issue where `setupFilesAfterEnv` was failing to resolve relative paths. The fix was using `<rootDir>/jest.setup.js`.

### C. Type Safety: `tsconfig.json`
To make the IDE understand Jest's global variables (`describe`, `it`, `expect`) and custom matchers, we explicitly added them to `tsconfig.json`:
```json
"types": ["jest", "node", "@testing-library/jest-dom"]
```

## 4. Implementation Journey (Challenges & Solutions)

### Challenge 1: The Windows + pnpm Compatibility
- **Issue**: `pnpm` uses symlinks which can confuse `next/jest`'s transformer on Windows, leading to "Transformer not found" errors.
- **Solution**: Switched to `npm` with a flat `node_modules` structure (`npm install --legacy-peer-deps`) which resolved the path resolution conflicts immediately.

### Challenge 2: HTML5 Validation in JSDOM
- **Issue**: The integration test for the Contact Page was failing to trigger validation errors. Cause: `JSDOM` attempts to enforce HTML5 validation (browser-native constraints) but handles events differently than a real browser event loop.
- **Solution**: Added `noValidate` to the `<form>` element in `app/kontak/page.tsx`. This bypasses native browser validation bubbles and lets our JavaScript validation (React Hook Form) handle the logic deterministically, which is what we actually want to test.

### Challenge 3: Asynchronous Testing
- **Issue**: React state updates are asynchronous. Assertions run before the DOM updates.
- **Solution**: Leveraged `waitFor()` and `findBy*` queries from RTL.
```javascript
// Wait for the success message to appear in the DOM
await waitFor(() => {
    expect(screen.getByText('Pesan Terkirim!')).toBeInTheDocument();
});
```

## 5. Key Testing Concepts

### Mocking (Faking Dependencies)
In `__tests__/pages/contact.test.tsx`, we didn't want to actually send data to PocketBase. We "mocked" the library:
```javascript
jest.mock('@/lib/pb', () => ({
    pb: {
        collection: jest.fn(() => ({
            create: jest.fn().mockResolvedValue({ id: '123' })
        }))
    }
}));
```
This intercepts calls to `pb.collection` and returns our fake function, allowing us to verify *that* it was called without side effects.

### Query Priority
When writing tests, prefer queries that resemble how users find elements:
1. `getByRole` ('button', 'link', 'heading') - Most accessible.
2. `getByLabelText` (for form inputs by visible label).
3. `getByPlaceholderText` (fallback).
4. `getByText` (for non-interactive content).
5. `getByTestId` (last resort, for specific elements like containers).

## 6. Next Steps
- Run tests regularly: `npm test`.
- Add integration tests for specific "Product Calculator" flows if implemented.
- maintain clean mocks if the backend SDK changes.
