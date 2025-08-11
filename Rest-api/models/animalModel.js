const { v4: uuidv4 } = require('uuid');

class Animal {
    constructor({ name, age, type, description, imageUrl, location, addedByUserId }) {
        this.id = uuidv4();
        this.name = name;
        this.age = age;
        this.type = type; 
        this.description = description;
        this.imageUrl = imageUrl;
        this.location = location;
        this.addedByUserId = addedByUserId;
        this.likes = 0;
        this.adopted = false;
    }
}

module.exports = Animal;
