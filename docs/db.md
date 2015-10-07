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
## Roles Table
- **role_id**: randomly generated id representing the role
- **role_name**: plaintext name for role such as 'writer' or 'user' 
```sql
CREATE TABLE sb.roles (
    role_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    role_name TEXT NOT NULL
);
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