const Tracker = require('./services/Tracker');
let interval = {};

chrome.runtime.onMessage.addListener(   
  function(request, sender, sendResponse) {
    let options = request;
    let time = request.time ? request.time : 0
    if(options.action === 'start') {
      const TrackerService = new Tracker(time);
      interval = TrackerService.start();
      console.log(interval);
      sendResponse({success: true, message: 'Started', time: interval.time});
    } else {
      const res = interval.pause();
      sendResponse({success: true, time: res});
    }
 
});