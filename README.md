# Ready to use Backend

This is the backend server to which has on the go functionalities with Node.js, Express, and MySQL. It handles user authentication, profile management, and other core functionalities.

## Features

- **User Authentication:**
  - Email & Password Registration with OTP verification.
  - Secure Login with Email/Username and Password.
  - Google OAuth 2.0 for seamless sign-in and sign-up.
- **Account Management:**
  - Password reset functionality via email OTP.
  - User profile picture updates.
  - Secure account deletion, including associated data.
- **API:**
  - RESTful API for all client-server interactions.
  - JWT-based authentication for securing endpoints.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A [MySQL](https://www.mysql.com/downloads/) server (or a compatible alternative like MariaDB).

## Database Setup

1.  Connect to your MySQL server and create a new database for the project.

    ```sql
    CREATE DATABASE your_db_name;
    ```

2.  Use the newly created database.

    ```sql
    USE your_db_name;
    ```

3.  Run the following SQL command to create the necessary `users` table with the specified schema.

    ```sql
    CREATE TABLE users (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) DEFAULT NULL,
        sex ENUM('M','F','O') DEFAULT NULL,
        dob DATE DEFAULT NULL,
        mobile VARCHAR(20) DEFAULT NULL,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        profile_url VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        isActive TINYINT(1) NOT NULL DEFAULT 0,
        reset_token VARCHAR(255) DEFAULT NULL,
        reset_token_expires DATETIME DEFAULT NULL,
        PRIMARY KEY (id)
    );
    ```

## Installation & Configuration

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd readyBackend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a configuration file:**

    Create a file named `.env` in the root of the `readyBackend` directory and add the following environment variables.

    ```properties
    # Server Port
    PORT=5000

    # Database Connection (MySQL Locally)
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name


    # JSON Web Token
    JWT_SECRET=your_super_secret_jwt_key

    # Google OAuth Client ID
    GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

    # Nodemailer (for sending emails)
    # Use an App Password if you have 2FA enabled on your Google account
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_google_app_password
    ```

    - Replace `your_db_user` and `your_db_password` with your MySQL credentials.
    - Set `JWT_SECRET` to a long, random, and secret string.
    - Obtain `GOOGLE_CLIENT_ID` from the Google API Console.
    - For `EMAIL_PASS`, it's highly recommended to use a Google App Password.

## Running the Application

### Development Mode

This command starts the server with `nodemon`, which automatically restarts the server on file changes.

```bash
npm run dev
```

### Production Mode

This command starts the server using `node`.

```bash
npm start
```

The server will be running on `http://localhost:5000` (or the port you specified in `.env`).

## API Endpoints

| Method  | Endpoint                               | Description                                       |
| :------ | :------------------------------------- | :------------------------------------------------ |
| `POST`  | `/api/auth/signup`                     | Register a new user with email and password.      |
| `POST`  | `/api/auth/login`                      | Log in a user with credentials.                   |
| `POST`  | `/api/auth/googleLogin`                | Log in or register a user with a Google ID token. |
| `POST`  | `/api/auth/send-registration-otp`      | Send an OTP to an email for account verification. |
| `POST`  | `/api/auth/logout`                     | Log out a user (sets `isActive` to 0).            |
| `POST`  | `/api/auth/send-forgot-password-otp`   | Send a password reset OTP to a user's email.      |
| `POST`  | `/api/auth/verify-forgot-password-otp` | Verify the password reset OTP.                    |
| `POST`  | `/api/auth/reset-password`             | Reset the user's password with a valid OTP.       |
| `POST`  | `/api/auth/delete-account/:userId`     | Delete a user's account and all their data.       |
| `PATCH` | `/api/user/updateprofile/:userId`      | Update a user's profile picture.                  |
| `GET`   | `/api/test/getusers`                   | (Test) Get all users from the database.           |
| `GET`   | `/api/test/test`                       | (Test) A simple test endpoint.                    |

---
