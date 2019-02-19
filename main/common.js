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
