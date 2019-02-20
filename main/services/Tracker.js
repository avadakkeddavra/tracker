class Tracker{
    constructor(time) {
        this.time = time;
        this.interval;
    }
    start() {
        this.interval = setInterval(() => {
            this.time++;
            if(this.time%5 === 0) {
                localStorage.setItem('tracked', this.time);
            }
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