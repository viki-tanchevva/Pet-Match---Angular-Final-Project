const { v4: uuidv4 } = require('uuid');

class User {
    constructor({ username, email, passwordHash, role = 'user' }) {
        this.id = uuidv4();
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role; // 'user' | 'shelter'
        this.likedAnimals = [];
    }
}

module.exports = User;
