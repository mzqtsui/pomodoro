(function(){
    "use strict";

    var stateIcons = {
        "play": "<i class='fa fa-play' aria-hidden='true'></i>",
        "pause": "<i class='fa fa-pause' aria-hidden='true'></i>"
    };

    var stateSpan = document.querySelector(".state");
    stateSpan.innerHTML = stateIcons["play"];

    var timeData = document.querySelector(".session-time");

    var timer = (function() {
        var state = "reset",    // current timer state
            maxTime = 5 * 60 + 1,  // max time in seconds
            currTime = maxTime; // current time in seconds

        return {
            play: () => {},
            reset: () => {
                state = "reset";
                currTime = maxTime;
            },
            pause: () => {},
            getTime: () => currTime,
            setTime: (newTime) => {
                maxTime = newTime;
                reset();
            },
            getFormattedTime: () => {
                var hours = Math.floor(currTime/60),
                    mins = currTime % 60;
                return  ((hours < 10) ? "0" + hours : hours) + ":" +
                        ((mins < 10) ? "0" + mins : mins);
            }
        };
    }());


    timeData.textContent = timer.getFormattedTime();

})();