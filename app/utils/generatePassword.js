function generateRandomPassword(length = 12) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%&*';

    if (length < 4) {
        throw new Error('Password length should be at least 4 characters.');
    }

    const allChars = uppercase + lowercase + numbers + specialChars;

    // Ensure the password contains at least one uppercase letter, one lowercase letter, one number, and one special character
    const getRandomChar = (chars) =>
        chars[Math.floor(Math.random() * chars.length)];
    const passwordArray = [
        getRandomChar(uppercase),
        getRandomChar(lowercase),
        getRandomChar(numbers),
        getRandomChar(specialChars),
    ];

    // Fill the rest of the password length with random characters
    for (let i = 4; i < length; i++) {
        passwordArray.push(getRandomChar(allChars));
    }

    // Shuffle the password array
    const shuffledPassword = passwordArray
        .sort(() => 0.5 - Math.random())
        .join('');

    return shuffledPassword;
}

module.exports = generateRandomPassword;
