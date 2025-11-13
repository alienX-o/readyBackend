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

## Installation & Configuration

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd ready-backend
    ```

2.  **Run the setup script:**

    This single command will:
    - Install all required `npm` dependencies.
    - Create a `.env` file from the `.env.example` template.
    - Connect to your database server and create the database and tables if they don't exist.
    - Remove the existing `.git` directory to clear the template's history.

    ```bash
    npm run setup
    ```

3.  **Update your environment variables:**

    Open the newly created `.env` file and fill in your specific credentials for the database, Google OAuth, Nodemailer, and create a secret API key.

    > **Important:** If the setup script failed during the database step, it's likely due to incorrect credentials in the `.env` file. Correct them and run `npm run setup` again.

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
