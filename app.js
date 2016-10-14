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
        sessionName = document.querySelector(".session-name"),
        lengthButtons = document.querySelectorAll(".length-btn"),
        breakLength = document.querySelector("#break-length"),
        workLength = document.querySelector("#work-length");


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

        var session = "work",       // current work/break state
            state = STATES.RESET,   // current timer state
            maxTime = {
                "work": 120,
                "break": 60
            },
            maxWorkTime = 120,        // max work time in seconds
            maxBreakTime = 60,        // max break time in seconds
            currTime = maxWorkTime,     // current time in seconds
            interval;

        return {
            start: () => {
                state = STATES.RUNNING;
                updateHoverIcon(state);
                interval = setInterval(function() {
                        currTime -= 1;
                        if (currTime < 0) {
                            session = (session === "work") ? "break" : "work";
                            currTime = maxTime[session];
                            clock.classList.toggle("break");
                            updateHoverIcon(state);
                            updateTime(currTime);
                            updateSessionName(session);
                        }
                        updateTime(currTime);
                    }, 1000);

            },
            reset: () => {
                state = STATES.RESET;
                session = "work";
                currTime = maxTime["work"];
                clock.classList.remove("break");
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
            getState: () => state,
            incrementMaxTime: (type) => {
                maxTime[type] += 60;
            },
            decrementMaxTime: (type) => {
                maxTime[type] -= 60;
            },
            getMaxMins: (type) => maxTime[type] / 60
        };
    }());

    updateHoverIcon(timer.getState());
    updateTime(timer.getTime());
    breakLength.setAttribute("value", timer.getMaxMins("break"));
    workLength.setAttribute("value", timer.getMaxMins("work"));

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

    lengthButtons.forEach((btn) => {
        var sessionType = btn.dataset.session,
            modType = btn.dataset.type;

        btn.addEventListener("click", (ev) => {
            if (modType === "plus")
                timer.incrementMaxTime(sessionType);
            else if (modType === "minus")
                timer.decrementMaxTime(sessionType);

            if(sessionType === "break")
                breakLength.setAttribute("value", timer.getMaxMins("break"));
            else if(sessionType === "work")
                workLength.setAttribute("value", timer.getMaxMins("work"));
        });
    });

})();