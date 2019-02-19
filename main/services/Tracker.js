class Tracker{
    constructor(task) {
        this.task = task;
        if(localStorage.getItem('tracked')) {
            this.time = Number(localStorage.getItem('tracked'));
        } else {
            this.time = 0;
            localStorage.setItem('tracked', 0);
        }
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
        this.task.time = this.time;
        return this.task;
    }
}

module.exports = Tracker;