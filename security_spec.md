# AquaFlow Security Specification

## 1. Data Invariants
- A `UserProfile` must be owned by the authenticated user (`userId` match).
- `HydrationLog` and `DailyTask` entries are strictly private sub-resources of a user.
- `Feedback` records must contain the `userId` of the subtractor and can only be written once.

## 2. The "Dirty Dozen" Payloads (Denial Expected)
1. **Identity Spoofing**: Attempt to create a profile for another UID.
2. **Sub-resource Hijacking**: Attempt to add a log to another user's sub-collection.
3. **Invalid Data Type**: Send a string for `weight`.
4. **Oversized String**: Send a 2MB comment in feedback.
5. **ID Poisoning**: Attempt to use `../../` in a document ID.
6. **State Skip**: Attempt to mark future tasks as completed (tasks are per-user, but should be sequential).
7. **Phantom Feedback**: Submit feedback with a different `userId` than the auth token.
8. **Feedback Modification**: Attempt to update another user's feedback.
9. **Private Profile Exposure**: Attempt to list all users.
10. **Admin Escalation**: Attempt to set `isAdmin: true` in the user profile (even if the field isn't in schema, it should be blocked).
11. **Timestamp Manipulation**: Send a `createdAt` in the future.
12. **Shadow Field Injection**: Adding `isVerified: true` to a profile.

## 3. Test Runner (Draft)
The `firestore.rules.test.ts` would verify these scenarios using the Firebase Emulator.
- `assertFails(setDoc(anotherUserDoc, data))`
- `assertFails(updateDoc(userDoc, { ghostField: true }))`
- `assertFails(addDoc(feedbackCol, { rating: 6 }))`
