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

    function updateInputs() {
        breakLength.setAttribute("value", timer.getMaxMins("break"));
        workLength.setAttribute("value", timer.getMaxMins("work"));
    }


    var timer = {

        session: "work",       // current work/break state
        state: STATES.RESET,   // current timer state
        maxTime: {
            "work": 120,
            "break": 60
        },
        currTime: 120,     // current time in seconds
        interval: null,

        start: function() {
            this.state = STATES.RUNNING;
            updateHoverIcon(this.state);
            this.interval = setInterval(function() {
                    this.currTime -= 1;
                    if (this.currTime < 0) {
                        this.session = (this.session === "work") ? "break" : "work";
                        this.currTime = this.maxTime[session];
                        clock.classList.toggle("break");
                        updateHoverIcon(this.state);
                        updateTime(this.currTime);
                        updateSessionName(this.session);
                    }
                    updateTime(this.currTime);
                }.bind(this), 1000);
        },
        reset: function() {
            this.state = STATES.RESET;
            this.session = "work";
            this.currTime = this.maxTime["work"];
            clock.classList.remove("break");
            updateHoverIcon(this.state);
            updateTime(this.currTime);
            updateSessionName(this.session);
            clearInterval(this.interval);
        },
        pause: function() {
            this.state = STATES.PAUSED;
            updateHoverIcon(this.state);
            clearInterval(this.interval);
        },
        getTime: function() { return this.currTime; },
        getState: function() { return this.state; } ,
        incrementMaxTime: function(type) {
            this.maxTime[type] += 60;
        },
        decrementMaxTime: function(type) {
            this.maxTime[type] -= 60;
            if(this.maxTime[type] < 60)
                this.maxTime[type] = 60;
        },
        getMaxMins: function(type) {
            return this.maxTime[type] / 60;
        }
    };

    updateHoverIcon(timer.getState());
    updateTime(timer.getTime());
    updateInputs();

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

            updateInputs();
            timer.reset();
        });
    });

})();