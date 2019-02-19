const Tracker = require('./services/Tracker');
let interval = {};

chrome.runtime.onMessage.addListener(   
  function(request, sender, sendResponse) {
    let options = request;
    let task = request.task ? request.task : {};
    if(options.action === 'start') {
      const TrackerService = new Tracker(task);
      invterval = TrackerService.start();
      sendResponse({success: true, message: 'Started'});
    } else {
      const res = invterval.pause();
      sendResponse({success: true, time: res.time});
    }
 
});