const TIME = 80


class Timer {
    constructor() {
        this.value = TIME 
        this.dom = document.querySelector('.time') 
    }

    reset() {
        this.value = TIME
    }

    up(increment) {
        this.value = this.value - increment
        this.timer = this.value - increment
    }

    get() {
        return this.value
    }

    set timer(val) {
        this.dom.innerHTML = this.value + ' s'
    }
}

let timer = new Timer

export default timer