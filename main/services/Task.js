class Task{
    constructor() {
        if(localStorage.getItem('tasks') && localStorage.getItem('tasks').length > 0) {
            this.tasks = JSON.parse(localStorage.getItem('tasks'));
        } else {
            this.tasks = []; 
            this.sync();
        }
        console.log(this.tasks);
    }
 
    create(task) {
        this.tasks.push(task);
        this.sync();
    }
    get(id) {
        return new Promise((resolve, reject) => {
           this.tasks[id] ? resolve(this.tasks[id]) : reject(new Error('Not found'));
        })
    }
    all() {
        return this.tasks;
    }

    find(name) {
        return this.tasks.filter((item, index) => {
            if(task.name === name || task.indexOf(name)) {
                item.index = index;
                return item;
            }
        });
    }

    delete(taskId) {
        const task = this.tasks.find((item) => item.id === taskId);
        this.tasks.forEach((item, inedx) => {
            if(item.id === taskId) {
                this.tasks.splice(index, 1);
            }
        })
        this.sync();
    }

    trackTime(taskIndex, time) {
        this.tasks[taskIndex].time = time;
        console.log(this.tasks[taskIndex].time);
        this.sync();
        return this.tasks[taskIndex];
    }

    sync() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}
module.exports = Task;