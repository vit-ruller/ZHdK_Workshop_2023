
class Score {
    constructor() {
        this.value = 0
        this.dom = document.querySelector('.score') 
    }

    reset() {
        this.value = 0
    }

    up(increment) {
        this.value = this.value + increment
        this.score = this.value + increment
    }

    get() {
        return this.value
    }

    set score(val) {
        this.dom.innerHTML = this.value
    }
}

let score = new Score

export default score