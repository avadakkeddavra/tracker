class Tracker{
    constructor(time) {
        this.time = time;
        this.interval;
    }
    start() {
        localStorage.setItem('tracked', this.time);
        this.interval = setInterval(() => {
            this.time++;
            localStorage.setItem('tracked', this.time);
        }, 1000);
        return this;
    }

    pause() {
        localStorage.setItem('tracked', this.time);
        clearInterval(this.interval);
        return this.getTaskTrackingTime();
    }
    getTaskTrackingTime() {
        return this.time;
    }
    stop() {
        clearInterval(this.interval);
        localStorage.setItem('tracked', 0);
        return this.time;
    }
}

module.exports = Tracker;