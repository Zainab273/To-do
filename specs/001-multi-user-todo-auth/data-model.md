# Data Model: Multi-User Todo Application with Authentication

**Feature Branch**: `001-multi-user-todo-auth`
**Date**: 2026-02-08
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)
**Research**: [research.md](./research.md)

## Summary

This document defines the database entities (User and Task) for the multi-user todo application, including their fields, types, constraints, and relationships. It also outlines the validation rules that apply to these entities.

---

## 1. User Entity

**Description**: Represents a registered user account in the system.

**Database Table**: `users` (hypothetical table name, subject to ORM mapping)

**Fields**:

| Field             | Type           | Constraints                               | Description                                     |
| :---------------- | :------------- | :---------------------------------------- | :---------------------------------------------- |
| `id`              | UUID           | Primary Key, Not Null, Unique, Indexed    | Unique identifier for the user.                 |
| `email`           | String (255)   | Not Null, Unique, Indexed                 | User's email address (used for login).          |
| `hashed_password` | String (255)   | Not Null                                  | Hashed password (never store plaintext).        |
| `created_at`      | Timestamp      | Not Null, Default: Current Timestamp      | Timestamp when the user account was created.    |

**Relationships**:
-   One-to-many with Task: A User can own zero or many Tasks. Tasks will have a foreign key (`user_id`) referencing the User's `id`.

**Validation Rules**:
-   **`email`**: Must be a valid email format (e.g., `user@example.com`).
-   **`password`** (during signup/signin, before hashing):
    -   Minimum 8 characters.
    -   At least one uppercase letter.
    -   At least one lowercase letter.
    -   At least one number.

---

## 2. Task Entity

**Description**: Represents a single todo item belonging to a user.

**Database Table**: `tasks` (hypothetical table name, subject to ORM mapping)

**Fields**:

| Field             | Type           | Constraints                               | Description                                             |
| :---------------- | :------------- | :---------------------------------------- | :------------------------------------------------------ |
| `id`              | UUID           | Primary Key, Not Null, Unique, Indexed    | Unique identifier for the task.                         |
| `title`           | String (500)   | Not Null                                  | The title or description of the todo item.              |
| `completed`       | Boolean        | Not Null, Default: `false`                | Indicates whether the task is complete (`true`) or not (`false`). |
| `user_id`         | UUID           | Not Null, Foreign Key to `users.id`, Indexed | ID of the user who owns this task.                      |
| `created_at`      | Timestamp      | Not Null, Default: Current Timestamp      | Timestamp when the task was created.                    |
| `updated_at`      | Timestamp      | Not Null, Default: Current Timestamp, On Update: Current Timestamp | Timestamp when the task was last modified.              |

**Relationships**:
-   Many-to-one with User: Each Task belongs to exactly one User via the `user_id` foreign key.

**Validation Rules**:
-   **`title`**:
    -   Must not be empty or whitespace-only.
    -   Maximum 500 characters.

**State Transitions**:
-   `completed`: Can transition between `false` and `true` (toggle).

---

## 3. Data Integrity & Constraints

-   **Foreign Key Constraint**: A task's `user_id` MUST always refer to a valid `id` in the `users` table. If a user is deleted, their associated tasks should either be deleted (CASCADE) or their `user_id` set to `NULL` (SET NULL) depending on business rules (CASCADE is likely for a todo app).
-   **Indexes**: `id` fields (Primary Keys) and `user_id` (Foreign Key in `tasks`) are indexed for efficient lookups and joins.
-   **Timestamps**: `created_at` and `updated_at` fields are automatically managed by the database or ORM to track changes.

---

**Data Model Status**: ✅ Complete