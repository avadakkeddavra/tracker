(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$(document).ready(() => {
    M.AutoInit();
    const Task = require('./services/Task');
    const TaskService = new Task();
    const Tracker = require('./services/Tracker');
    const TrackerService = new Tracker();
    let CurrentTask = null;
    const state = {
        started: false,
        rebuild: () => {
            if(state.started) {
                $('#tasks').attr('disabled','disabled');
                $('#tasks').formSelect()
            } else {
                $('#tasks').removeAttr('disabled');
                $('#tasks').formSelect()
            }
        }
    }

    const render = () => {
        let options = '';
        TaskService.all().forEach((item, index) => {
            options += `<option value=${index}>${item.name} (${item.time})</option>`;
        });
        $('#tasks').html(options);
        $('#tasks').formSelect();
    }

    render();

    $('#options').on('click', () => {
        chrome.runtime.openOptionsPage();
    })
    
    $('#create').on('click', () => {
        const name = $('#name').val();
        if(name.length > 0) {
            TaskService.create({
                name: name,
                time: 0
            });
        }
        render();
    });

    $('#tasks').on('change', () => {

        TaskService.get(Number($('#tasks').val())).then((task) => {
            CurrentTask = task;
            CurrentTask.index = Number($('#tasks').val());
            console.log(CurrentTask);
        }).catch((err) => {
            console.log(err);
        })
    })

    $('#start').click(() => {
        if(CurrentTask){
            chrome.runtime.sendMessage({task: CurrentTask, action: 'start'}, function(response) {
                state.started = true;
                state.rebuild();
            });
        }
    })
    $('#pause').click(() => {
        if(CurrentTask){
            chrome.runtime.sendMessage({action: 'pause'}, function(response) {
               CurrentTask.time = response.time;
               console.log(TaskService.trackTime(CurrentTask.index, response.time));
               render();
               state.started = false;
               state.rebuild();
            });
        }
    })
})

},{"./services/Task":2,"./services/Tracker":3}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{}]},{},[1])