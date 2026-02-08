---
name: database-schema
description: Design database tables, migrations, and schema architecture. Use for setting up data models and database structure.
---

# Database Skill – Create Tables, Migrations, Schema Design

## Instructions

1. **Schema Design**
   - Identify entities and relationships
   - Normalize data structure (3NF minimum)
   - Define primary and foreign keys
   - Plan indexes for query optimization

2. **Table Creation**
   - Use appropriate data types
   - Set constraints (NOT NULL, UNIQUE, CHECK)
   - Define default values
   - Add timestamps (created_at, updated_at)

3. **Migrations**
   - Write reversible migrations (up/down)
   - Use incremental changes
   - Include rollback strategies
   - Version control migration files

4. **Relationships**
   - One-to-many (foreign keys)
   - Many-to-many (junction tables)
   - One-to-one (rare, justify usage)
   - Cascade rules (ON DELETE, ON UPDATE)

## Best Practices

- **Naming conventions**: Use snake_case for tables and columns
- **Primary keys**: Use auto-incrementing integers or UUIDs
- **Indexing**: Add indexes on foreign keys and frequently queried columns
- **Data types**: Choose the smallest appropriate type (INT vs BIGINT)
- **Avoid**: Over-normalization, premature optimization, EAV patterns
- **Documentation**: Comment complex constraints and business rules

## Example Structure
```sql
-- Migration: create_users_table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- Migration: create_posts_table
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_published_at ON posts(published_at);

-- Migration: create_tags_and_junction_table
CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post_tags (
  post_id BIGINT NOT NULL,
  tag_id BIGINT NOT NULL,
  PRIMARY KEY (post_id, tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

## Common Patterns

**Soft Deletes**
```sql
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP NULL;
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
```

**Enum Types**
```sql
CREATE TYPE user_role AS ENUM ('admin', 'user', 'moderator');
ALTER TABLE users ADD COLUMN role user_role DEFAULT 'user';
```

**Audit Trail**
```sql
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  table_name VARCHAR(50) NOT NULL,
  record_id BIGINT NOT NULL,
  action VARCHAR(20) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  user_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Checklist Before Deployment

- [ ] All foreign keys have indexes
- [ ] Constraints are properly defined
- [ ] Migration can be rolled back
- [ ] Seed data prepared (if needed)
- [ ] Backup strategy in place
- [ ] Performance tested with expected data volume