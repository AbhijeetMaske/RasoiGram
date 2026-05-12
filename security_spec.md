# RasoiGram Security Specification

## 1. Data Invariants
- An inventory item MUST belong to a user.
- A user can only read/write their own inventory.
- Recipes in history are private to the user.
- User profile data is private to the user owner.

## 2. Dirty Dozen Payloads (Rejection Targets)
1. **Identity Spoofing**: Attempt to create an inventory item with `userId` of another user.
2. **Orphaned Write**: Create an inventory item without a parent user document.
3. **Ghost Field**: Update user profile with `isAdmin: true`.
4. **State Injection**: Manually set `generatedAt` to a future date.
5. **Path Poisoning**: Create an inventory item with an ID 2KB long.
6. **PII Leak**: Guest user attempting to `get()` a user profile by email.
7. **Bulk Scraping**: Authenticated user calling `list()` on all users.
8. **Shadow Delete**: Deleting another user's recipe history.
9. **Mutation Gap**: Updating an inventory item's `name` but not `updatedAt` (if enforced).
10. **Type Poisoning**: Sending `category: 123` instead of string.
11. **Size Attack**: Sending a `name` that is 500 characters long.
12. **Relational Sync**: Adding a recipe to history without it being correctly formatted.

## 3. Implementation Plan
- Use `isValidId()` for all document IDs.
- Use `isValidIngredient()` and `isValidUser()` helpers.
- Enforce `affectedKeys().hasOnly()` for updates.
