const bcrypt = require('bcrypt');
const db = require('./config/db'); // Adjust path to your database connection file

async function hashPasswords() {
    try {
        // Step 1: Retrieve all users from the database
        const [users] = await db.query('SELECT user_id, password FROM users');

        for (const user of users) {
            if (user.password) {
                // Step 2: Hash the plain-text password
                const hashedPassword = await bcrypt.hash(user.password, 10); // 10 salt rounds

                // Step 3: Update the database with the hashed password
                await db.query('UPDATE users SET password = ? WHERE user_id = ?', [hashedPassword, user.user_id]);
                console.log(`Password for user ID ${user.user_id} has been hashed.`);
            }
        }

        console.log('All passwords have been hashed successfully.');
    } catch (error) {
        console.error('Error hashing passwords:', error);
    } finally {
        db.end(); // Close the database connection
    }
}

// Run the script
hashPasswords();
