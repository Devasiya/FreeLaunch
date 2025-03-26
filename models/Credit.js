// models/Coin.js
class ReferralCoin {
    constructor() {
        this.value = 10; // Example value for referral coins
    }
}

class ProjectCompletionCoin {
    constructor() {
        this.value = 20; // Example value for project completion coins
    }
}

module.exports = { ReferralCoin, ProjectCompletionCoin };