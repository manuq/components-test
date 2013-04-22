enyo.kind({
  name: "TimerRange",
  kind: "enyo.Input",
  type: "range",
  attributes: {min: "10", max: "200", step: "10", value: "100"}
});

enyo.kind({
  name: "Chronometer",
  classes: "chronometer",
  components: [
    {name: "counter", tag: "p", content: "Hello World!"},
    {kind: "Button", content: "Start", ontap: "startTap"},
    {kind: "Button", content: "Stop", ontap: "stopTap"},
    {kind: "Button", content: "Reset", ontap: "resetTap"},
    {tag: "label", content: "Speed:"},
    {name: "timerRange", kind: "TimerRange", onchange: "timerChange"},
    {name: "speedLabel", classes: "speed-label", tag: "label",
     content: "Normal"}
  ],

  tenthsOfSecond: 0,
  seconds: 0,
  minutes: 0,
  stepMiliseconds: 100,
  jobName: "",

  drawTime: function() {
    var content = this.minutes + ':' + this.seconds + '.' + this.tenthsOfSecond;
    this.$.counter.setContent(content);
  },

  chronometer: function() {
    this.tenthsOfSecond += 1;
    if (this.tenthsOfSecond == 10) {
      this.tenthsOfSecond = 0;
      this.seconds += 1;
    }
    if (this.seconds == 60) {
      this.seconds = 0;
      this.minutes += 1;
    }

    this.drawTime();

    // call this function again in 100 miliseconds
    enyo.job(this.jobName, enyo.bind(this, "chronometer"),
             this.stepMiliseconds);
  },

  startTap: function() {
    this.chronometer();
  },
  stopTap: function() {
    enyo.job.stop(this.jobName);
  },
  resetTap: function() {
    this.tenthsOfSecond = 0;
    this.seconds = 0;
    this.minutes = 0;
    this.drawTime();
  },
  timerChange: function() {
    this.stepMiliseconds = 200 - this.$.timerRange.value;
    var speed;
    if (this.stepMiliseconds == 100) {
      speed = 'Normal';
    }
    else {
      speed = Math.round(this.$.timerRange.value) / 100 + 'x';
    }
    this.$.speedLabel.setContent(speed);
  }
});

enyo.kind({
  name: "StopwatchActivity",
  components: [
    {kind: "Chronometer", jobName: "A"},
    {kind: "Chronometer", jobName: "B"},
    {kind: "Chronometer", jobName: "C"}
  ]
});

new StopwatchActivity().renderInto(document.getElementById("canvas"));
