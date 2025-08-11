const { v4: uuidv4 } = require('uuid');

class AdoptionRequest {
    constructor({ userId, animalId, message }) {
        this.id = uuidv4();
        this.userId = userId;
        this.animalId = animalId;
        this.message = message;
        this.status = 'pending'; // 'pending' | 'approved' | 'declined'
    }
}

module.exports = AdoptionRequest;
