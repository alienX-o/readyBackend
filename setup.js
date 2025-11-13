const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

const envExamplePath = path.join(__dirname, ".env.example");
const envPath = path.join(__dirname, ".env");

function askQuestion(query, isPassword = false) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });

    if (isPassword) {
      // Mute stdout for password input
      // This is a workaround since readline doesn't have a built-in password option.
      const onData = () => {
        const chars = "*".repeat(rl.line.length);
        process.stdout.cursorTo(query.length);
        process.stdout.write(chars);
      };
      rl.input.on("data", onData);
    }
  });
}

async function setupDatabase() {
  // Load dependencies now that they are installed
  require("dotenv").config();
  const mysql = require("mysql2/promise");

  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    console.error(
      "❌ Database environment variables are not set. Please check your .env file."
    );
    process.exit(1);
  }

  const dbConfig = {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
  };

  let connection;
  try {
    // 1. Connect to MySQL server without specifying a database
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Connected to MySQL server.");

    // 2. Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`✅ Database '${DB_NAME}' is ready.`);

    // 3. Close initial connection and connect to the new database
    await connection.end();
    const dbPool = mysql.createPool({ ...dbConfig, database: DB_NAME });

    // 4. Create the 'users' table if it doesn't exist
    const tableCreationQuery = `
      CREATE TABLE IF NOT EXISTS users (
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
      );`;
    await dbPool.query(tableCreationQuery);
    console.log("✅ Table 'users' is ready.");
    await dbPool.end();
  } catch (error) {
    console.error("❌ Error during database setup:", error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

async function configureEnvironment() {
  console.log("\n[2/4] Configuring environment...");
  if (!fs.existsSync(envPath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log("✅ .env file created from .env.example.");
  } else {
    console.log("✅ .env file already exists.");
  }

  console.log("Please provide your database credentials:");

  const dbHost = (await askQuestion("Database Host (default: localhost): ")) || "localhost";
  const dbUser = await askQuestion("Database User (default: root): ") || "root";
  const dbPassword = await askQuestion("Database Password: ", true);
  const dbName = await askQuestion("Database Name (default: ready_backend_db): ") || "ready_backend_db";

  let envContent = fs.readFileSync(envPath, "utf-8");

  envContent = envContent.replace(/^DB_HOST=.*/m, `DB_HOST=${dbHost}`);
  envContent = envContent.replace(/^DB_USER=.*/m, `DB_USER=${dbUser}`);
  envContent = envContent.replace(/^DB_PASSWORD=.*/m, `DB_PASSWORD=${dbPassword}`);
  envContent = envContent.replace(/^DB_NAME=.*/m, `DB_NAME=${dbName}`);

  fs.writeFileSync(envPath, envContent);
  console.log("✅ .env file updated with your database credentials.");
  console.log("Please fill in the remaining values (Google OAuth, Nodemailer, etc.) in the .env file.");
}

async function main() {
  console.log("🚀 Starting project setup...");

  // Step 1: Install npm dependencies
  console.log("\n[1/4] Installing dependencies...");
  execSync("npm install", { stdio: "inherit" });
  console.log("✅ Dependencies installed.");

  // Step 2: Configure environment
  await configureEnvironment();
  // Step 3: Setup database
  console.log("\n[3/4] Setting up database...");
  await setupDatabase();

  // Step 4: Remove .git directory to clear history
  console.log("\n[4/4] Removing existing Git history...");
  const gitPath = path.join(__dirname, ".git");
  if (fs.existsSync(gitPath)) {
    fs.rmSync(gitPath, { recursive: true, force: true });
    console.log("✅ .git directory removed. You can now initialize a new repository.");
  } else {
    console.log("✅ No .git directory found to remove.");
  }

  console.log("\n🎉 Setup complete! You can now run the server with 'npm run dev'. Now running the server for the first time the .env.example file and setup files will be automatically removed now");
  const setupPath = path.join(__dirname, "setup.js");
  const envExamplePath = path.join(__dirname, ".env.example");
  if (fs.existsSync(setupPath)) {
    fs.unlinkSync(setupPath);
    console.log("✅ setup.js file removed.");
  }
  if (fs.existsSync(envExamplePath)) {
    fs.unlinkSync(envExamplePath);
    console.log("✅ .env.example file removed.");
  }

  
  execSync("npm run dev", { stdio: "inherit" });
}

main();