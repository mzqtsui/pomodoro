(function(){
    "use strict";

    var stateIcons = {
        "play": "<i class='fa fa-play' aria-hidden='true'></i>",
        "pause": "<i class='fa fa-pause' aria-hidden='true'></i>"
    };

    var stateSpan = document.querySelector(".state");
    stateSpan.innerHTML = stateIcons["play"];

    var timeData = document.querySelector(".session-time"),
        clock = document.querySelector(".clock");


    function formatTime(secs) {
        var hours = Math.floor(secs/60),
            mins = secs % 60;
        return  ((hours < 10) ? "0" + hours : hours) + ":" +
                ((mins < 10) ? "0" + mins : mins);
    }

    function updateTime(time) {
        timeData.textContent = formatTime(time);
    }


    var timer = (function() {
        const STATES = {
            "RESET":    0,
            "RUNNING":  1,
            "PAUSED":   2
        };

        var state = STATES.RESET,    // current timer state
            maxTime = 1,        // max time in seconds
            currTime = maxTime, // current time in seconds
            interval;

        return {
            start: () => {
                state = STATES.RUNNING;
                interval = setInterval(function() {
                        currTime -= 1;
                        if (currTime < 0) {
                            currTime = 0;
                            state = STATES.RESET;
                            clearInterval(interval);
                        }
                        updateTime(currTime);
                    }, 1000);

            },
            reset: () => {
                state = STATES.RESET;
                currTime = maxTime;
            },
            pause: () => {
                state = STATES.PAUSED;
            },
            getTime: () => currTime,
            setTime: (newTime) => {
                maxTime = newTime;
                reset();
            }
        };
    }());


    updateTime(timer.getTime());

    clock.addEventListener("click", () => {
        timer.start();
    });

})();