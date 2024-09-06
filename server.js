// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Store verification codes (for demo purposes; in a real app, use a database)
let verificationCodes = {};

// Setup Nodemailer transporter (you can use Gmail or another service)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

// Serve the forgot password form
app.get('/forgot-password', (req, res) => {
    res.sendFile(__dirname + '/forgot_password.html');
});

// Handle forgot password form submission
app.post('/forgot-password', (req, res) => {
    const email = req.body.email;

    // Generate a random 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the code in the "database" (in-memory for this example)
    verificationCodes[email] = verificationCode;

    // Send the email with the verification code
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Password Reset Verification Code',
        text: `Your password reset code is: ${verificationCode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
        res.send('A verification code has been sent to your email.');
    });
});

// Serve the verification code form
app.get('/verify', (req, res) => {
    res.send(`
        <h2>Verify your code</h2>
        <form action="/verify-code" method="POST">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required><br><br>

            <label for="code">Verification Code:</label>
            <input type="text" id="code" name="code" required><br><br>

            <button type="submit">Verify</button>
        </form>
    `);
});

// Verify the code
app.post('/verify-code', (req, res) => {
    const { email, code } = req.body;

    // Check if the code matches
    if (verificationCodes[email] && verificationCodes[email] === code) {
        // Redirect user to reset password form (serve it or generate the form dynamically)
        res.send(`
            <h2>Reset Password</h2>
            <form action="/reset-password" method="POST">
                <input type="hidden" name="email" value="${email}" />
                <label for="password">New Password:</label>
                <input type="password" id="password" name="password" required><br><br>
                <button type="submit">Reset Password</button>
            </form>
        `);
    } else {
        res.send('Invalid verification code.');
    }
});

// Handle password reset form submission
app.post('/reset-password', (req, res) => {
    const { email, password } = req.body;

    // Reset the password (in a real app, you'd update this in the database)
    console.log(`Password for ${email} has been reset to: ${password}`);

    // Notify the user
    res.send('Your password has been successfully reset!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
