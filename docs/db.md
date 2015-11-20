# PostgreSQL Database Queries
---
## Add the `pgcrypto` Extrension
Our database uses the `pgcrypto` extension to create random user id's and salted/hashed user passwords.
```sql
CREATE EXTENSION pgcrypto;
```
## Storybored Schema
```sql
CREATE SCHEMA sb;
```

## Users Table
- **user_id**: randomly generated, unique user id
- **username**: the user's handle; must be unique
- **password**: simple text password that's hashed/salted on insertion
- **first_name**: user's first name
- **last_name**: user's last name
- **email**: user's email address
- **since**: the timestamp of when the user was created
- **profile_img**: text path to the user's image in `img/profiles`
```sql
CREATE TABLE sb.users (
    user_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    since TIMESTAMP DEFAULT now(),
    profile_img TEXT DEFAULT 'img/profiles/default.jpg'
);
```

## Invitations Table
- **key**: distinct uuid to identify an invitation 
- **email**: associated email
- **timestamp**: timestamp to determine age of invitation
```sql
CREATE TABLE sb.invitations (
  key UUID PRIMARY KEY DEFAULT get_random_uuid(),
  email TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT now()
);
```

#### Invitation Deletion Trigger
A trigger to delete invitations that have existed more than 3 days.
```sql
CREATE FUNCTION delete_expired_invitations() RETURNS trigger
  language plpgsql
  as $$
BEGIN
  DELETE FROM sb.invitations WHERE timestamp < now() - INTERVAL '3 days';
  RETURN NEW;
END;
$$;

CREATE trigger delete_expired_invitations_trigger
  AFTER INSERT ON sb.invitations
  EXECUTE PROCEDURE delete_expired_invitations();
```

## Roles Table
- **role_id**: randomly generated id representing the role
- **role_name**: plaintext name for role such as 'writer' or 'user' 
```sql
CREATE TABLE sb.roles (
    role_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    role_name TEXT NOT NULL
);  P
```

## User-Roles Table
- **user_id**: the associated user's id
- **role_id**: the associated user's role
```sql
CREATE TABLE sb.user_roles (
    user_id UUID NOT NULL PRIMARY KEY REFERENCES sb.users (user_id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES sb.roles (role_id)
);
```

## Image Tints
A tint type for use in the `sb.articles` table.
```sql
CREATE TYPE tint AS ENUM ('red', 'green', 'blue', 'pink');
```
## Articles
- **article_id**: the article's id
- **user_id**: the associated user's id
- **title**: the title of the article
- **byline**: small description of the article
- **body**: the article content (in markdown)
- **img_tint**: tint that corresponds to css classes for the article image
- **date**: the date the article was created
- **textsearch**: a searchable vector of the article's title, byline, and body
```sql
CREATE TABLE sb.articles (
  article_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES sb.users (user_id),
  title TEXT NOT NULL,
  byline TEXT NOT NULL,
  body TEXT NOT NULL,
  img_tint tint,
  date TIMESTAMP DEFAULT now(),
  textsearch to_tsvector('english', coalesce(title,'') || ' ' || coalesce(byline, '') || ' ' || coalesce(body, ''))
);
```
```sql
CREATE INDEX textsearch_idx ON sb.articles USING gin(textsearch);
```