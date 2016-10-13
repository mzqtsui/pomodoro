(function(){
    "use strict";

    const STATES = {
        "RESET":    0,
        "RUNNING":  1,
        "PAUSED":   2
    };

    const STATE_ICONS = {
        "PLAY": "<i class='fa fa-play' aria-hidden='true'></i>",
        "PAUSE": "<i class='fa fa-pause' aria-hidden='true'></i>"
    };

    var stateSpan = document.querySelector(".state"),
        timeData = document.querySelector(".session-time"),
        clock = document.querySelector(".clock"),
        sessionName = document.querySelector(".session-name");


    function formatTime(secs) {
        var hours = Math.floor(secs/60),
            mins = secs % 60;
        return  ((hours < 10) ? "0" + hours : hours) + ":" +
                ((mins < 10) ? "0" + mins : mins);
    }

    function updateSessionName(lastSession) {
        sessionName.textContent = lastSession;
    }

    function updateTime(time) {
        timeData.textContent = formatTime(time);
    }

    function updateHoverIcon(state) {
        switch (state) {
            case STATES.RESET:
                stateSpan.innerHTML = STATE_ICONS.PLAY;
                break;

            case STATES.RUNNING:
                stateSpan.innerHTML = STATE_ICONS.PAUSE;
                break;

            case STATES.PAUSED:
                stateSpan.innerHTML = STATE_ICONS.PLAY;
                break;
            default:

        }
    }


    var timer = (function() {

        var session = "Work",       // current work/rest state
            state = STATES.RESET,   // current timer state
            maxWorkTime = 5,        // max work time in seconds
            maxRestTime = 3,        // max rest time in seconds
            currTime = maxWorkTime,     // current time in seconds
            interval;

        return {
            start: () => {
                state = STATES.RUNNING;
                updateHoverIcon(state);
                interval = setInterval(function() {
                        currTime -= 1;
                        if (currTime < 0) {
                            session = (session === "Work") ? "Rest" : "Work";
                            currTime = (session === "Work") ? maxWorkTime : maxRestTime;
                            clock.classList.toggle("rest");
                            updateHoverIcon(state);
                            updateTime(currTime);
                            updateSessionName(session);
                        }
                        updateTime(currTime);
                    }, 1000);

            },
            reset: () => {
                state = STATES.RESET;
                session = "Work";
                currTime = maxWorkTime;
                clock.classList.remove("rest");
                updateHoverIcon(state);
                updateTime(currTime);
                updateSessionName(session);
            },
            pause: () => {
                state = STATES.PAUSED;
                updateHoverIcon(state);
                clearInterval(interval);
            },
            getTime: () => currTime,
            getState: () => state
        };
    }());

    updateHoverIcon(timer.getState());
    updateTime(timer.getTime());

    clock.addEventListener("click", () => {
        switch (timer.getState()) {
            case STATES.RESET:
                timer.start();
                break;

            case STATES.RUNNING:
                timer.pause();
                break;

            case STATES.PAUSED:
                timer.start();
                break;
            default:

        }
    });

})();