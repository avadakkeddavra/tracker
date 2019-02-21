$(document).ready(() => {

    M.AutoInit();
    const Task = require('./services/Task');
    const moment = require('moment');

    const TaskService = new Task();
    let CurrentTask = JSON.parse(localStorage.getItem('currentTask'));
    const state = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : {
        started: false
    }
    let interval;

    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd',
        defaultDate: localStorage.getItem('sortDate') ? localStorage.getItem('sortDate') : Date.now(),
        setDefaultDate: true
    });
    $('.datepicker').on('change', function() {
        localStorage.setItem('sortDate', $('.datepicker').val());
        // renderTasks();
    })
    const rebuild = () =>{
        if(state.started) {
            $('#tasks').attr('disabled','disabled');
            $('#tasks').formSelect()
        } else {
            $('#tasks').removeAttr('disabled');
            $('#tasks').formSelect()
        }
    }
    const normalizeTime = (rawTime) => {
        return {
            seconds: rawTime%60,
            minutes: Math.floor(rawTime/60),
            hours: Math.floor(rawTime/(60*60))
        }
    }
    const startLocalTimer = () => {
        console.log(CurrentTask);
        console.log(state.started);
        console.log(localStorage.getItem('tracked'));
        if(CurrentTask && state.started === true && localStorage.getItem('tracked')) {
            let rawTime = Number(localStorage.getItem('tracked'));
            interval = setInterval(() => {
                rawTime++;
                renderTimer(normalizeTime(rawTime));
            }, 1000);
            localStorage.setItem('interval', interval);
        }
    }
    const renderTimer = (time) => {
        console.log(time)
        const hours = time.hours < 10 ? '0'+time.hours : time.hours;
        const minutes = time.minutes < 10 ? '0'+time.minutes : time.minutes;
        const seconds = time.seconds < 10 ? '0'+time.seconds : time.seconds;

        const timeString = hours+':'+minutes+':'+seconds;
        $('.timer').html(timeString);
    }
    const renderTasks = () => {
        let options = '<option value="" disabled selected>Choose your option</option>';
        TaskService.all().forEach((item, index) => {
            const time = normalizeTime(item.time);
            const hours = time.hours < 10 ? '0'+time.hours : time.hours;
            const minutes = time.minutes < 10 ? '0'+time.minutes : time.minutes;
            const seconds = time.seconds < 10 ? '0'+time.seconds : time.seconds;
    
            const timeString = hours+':'+minutes+':'+seconds;
            options += `<option value="${index}" ${CurrentTask && CurrentTask.index === index ? 'selected': '' }>${item.name} (${timeString})</option>`;
        });

        $('#tasks').html(options);
        $('#tasks').formSelect();
    }
    const render = () => {
        renderTasks();
        if(state.started === false && CurrentTask) {
            $('#start').removeAttr('disabled');
        } else if(state.started === true) {
            $('#start').attr('disabled', 'disabled');
            $('#pause').removeAttr('disabled');
        }
        renderTimer(normalizeTime(localStorage.getItem('tracked')));
        if(CurrentTask) {
            if(state.started === true) {
                startLocalTimer();
            }
        }
        localStorage.setItem('state', JSON.stringify(state));
         if(localStorage.getItem('sortDate')) {
             $('.datepicker').val(localStorage.getItem('sortDate'));
         }
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
                time: 0,
                date: moment().format("YYYY-MM-DD HH:mm:ss")
            });
            CurrentTask = {
                name: name,
                time: 0,
                index: 0
            };
            localStorage.setItem('currentTask', JSON.stringify(CurrentTask));
            $('#name').val(null);
            renderTasks();
            $('#start').removeAttr('disabled'); 
        }
        
    });

    $('#tasks').on('change', () => {
        console.log('hello')
        TaskService.get(Number($('#tasks').val())).then((task) => {
            CurrentTask = task;
            localStorage.setItem('tracked', CurrentTask.time);
            renderTimer(normalizeTime(CurrentTask.time));
            $('#start').removeAttr('disabled'); 
            CurrentTask.index = Number($('#tasks').val());
            localStorage.setItem('currentTask', JSON.stringify(CurrentTask));
            console.log(CurrentTask);
        }).catch((err) => {
            console.log(err);
        })
    })

    $('#start').click(() => {
        if(CurrentTask){
            chrome.runtime.sendMessage({time: CurrentTask.time, action: 'start'}, function(response) {
                localStorage.setItem('tracked', CurrentTask.time);
                state.started = true;
                rebuild();
                localStorage.setItem('state', JSON.stringify(state));
                console.log(response)   
                $('#start').attr('disabled', 'disabled');
                $('#pause').removeAttr('disabled');
                startLocalTimer()
            });
        }
    })
    $('#pause').click(() => {
        if(CurrentTask){
            chrome.runtime.sendMessage({action: 'pause'}, (response) => {
                console.log(response);
                if(response && response.time) {
                    CurrentTask.time = response.time;
                    localStorage.setItem('currentTask', JSON.stringify(CurrentTask));
                    console.log(TaskService.trackTime(CurrentTask.index, response.time));
                }
                state.started = false;
                clearInterval(interval);
                $('#start').removeAttr('disabled');
                $('#pause').attr('disabled', 'disabled');
                rebuild();
                localStorage.setItem('state', JSON.stringify(state));
                localStorage.setItem('interval', interval);
                renderTasks();
            });
        }
    })
})
