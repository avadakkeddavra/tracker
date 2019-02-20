(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
        return this.tasks.sort((a,b) => {
            if(a.date < b.date) {
                return 1
            } else if(a.date > b.date) {
                return -1
            } else {
                return 0;
            }
        });
        // if(localStorage.getItem('sortDate')) {
        //     tasks = tasks.filter((item) => {
        //         if(item.date.indexOf(localStorage.getItem('sortDate')) != -1){
        //             return item;
        //         }
        //     })
        // }
        
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
},{}]},{},[1])