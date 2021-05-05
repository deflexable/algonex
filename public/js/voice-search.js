import GcpAPI from './gcp-api.js';
//import './socket_io.js';

$(micId_).off('click');

var recognition = null,
    gcpAPI = new GcpAPI(),
    isTranscripting = false,
    rcf = '.prod-search-recorder-con',
    startMicAudio = new Audio('aud/micStart.mp3'),
    endMicAudio = new Audio('aud/micEnd.mp3');
/*
    socket = io.connect(location.origin);*/


function configureChromeRecorder() {
    console.log('started');
    recognition = new webkitSpeechRecognition();
    recognition.interimResults = true;
    recognition.onresult = function (event) {
        var query = event.results[0][0].transcript;
        endMicAudio.play();
        console.log(event);
        respondToRecordedData(query);
    };
    console.log('started bottom');
}

if (isChromeAPIAvailable()) {
    configureChromeRecorder();
} else {
    gcpAPI.configureAPI(socket, respondToRecordedData());
}
/*
socket.on("endSpeechRecognition", _ => {
    console.log('stopped talking =', _);
    isTranscripting = false;
    $(rcf).hide();
    gcpAPI.stopTranscription(socket);
});*/

function respondToRecordedData(data) {
    toggleListening('block', 'none');
    $(rcf + ' small').html('Processing...');
    $(rcf + ' span').html(data);
    location.href = pathForRecordedSearchData_ + data;
}

function toggleListening(smallDisplay, boldDisplay) {
    $(rcf + ' small').css('display', smallDisplay);
    $(rcf + ' b').css('display', boldDisplay);

}
var listenTimeOut = null;
$(micId_).click(function () {
    toggleListening('none', 'block');
    $(rcf).show(500);
    clearTimeout(listenTimeOut);
    startMicAudio.play();

    listenTimeOut = setTimeout(() => {
        toggleListening('block', 'none');
    }, 1500);

    if (isChromeAPIAvailable()) {
        if (isTranscripting) {
            recognition.stop();
            isTranscripting = false;
        } else {
            recognition.start();
            isTranscripting = true;
        }
    } else {
        if (isTranscripting) {
            gcpAPI.stopTranscription(socket);
            isTranscripting = false;
        } else {
            gcpAPI.startTranscription(socket);
            isTranscripting = true;
        }
    }
});

$(micId_).trigger('click');

function isChromeAPIAvailable() {
    if (window.webkitSpeechRecognition !== undefined) {
        return true;
    } else {
        return false;
    }
}