/*
fissare massimo numero di rings
fissare massimo numero di step
aggiustare slider velocità, deve partire da un minimo
mostrare la velocità in bpm

fixare problema quando cancelli tutti i rings
fare più stati e menu a tendina per scegliere stato e nome stato

registrazione canzone generata
libreria di ritmi/poliritmi
salvare e caricare lo stato su firebase DA FARE
METTERE SU GITHUB
rhythm recognition
rhythm library
*/
import Vue from '../node_modules/vue/dist/vue';
import vSelect from "../node_modules/vue-select/dist/vue-select";
import "../node_modules/vue-select/dist/vue-select.css";
import * as Tone from '../node_modules/tone/build/Tone';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue' // Import Bootstrap an BootstrapVue CSS files (order is important)import 'bootstrap/dist/css/bootstrap.css'import 'bootstrap-vue/dist/bootstrap-vue.css'// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
    // Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.component("v-select", vSelect);

var app = new Vue({
    el: "#app",
    data: {
        rings: [],
        players: [],
        ringHighlighted: null,
        stepHighlighted: null,
        lastRingHighlighted: null,
        lastStepHighlighted: null,
        instruments: [],
        players: [],
        center: null,
        absMinRadius: null,
        width: null,
        distance: null,
        canvas: null,
        context: null,
        currentDegree: 0,
        speed: 3,
        playPause: 0,
        selectedRing: null,
        selectedInstrument: null,
        selectedColor: null,
        selectedState: null,
        stateName: null,
        colors: ["red", "orange", "yellow", "green", "blue"],
        document: null,
        savedState: {}
    },
    methods: {
        getStates: function() {
            return Object.keys(this.savedState)
        },

        range: function(start, stop, step) {
            step = step || 1;
            var arr = [];
            for (var i = start; i < stop; i += step) {
                arr.push(i);
            }
            return arr;
        },

        saveState: function(name) {
            this.savedState[name] = []

            for (var i = 0; i < this.rings.length; ++i) {
                this.savedState[name].push({})

                this.savedState[name][i].steps = this.rings[i].steps;
                this.savedState[name][i].instrumentIndex = this.rings[i].instrumentIndex;
                this.savedState[name][i].color = this.rings[i].color;

                this.savedState[name][i].pattern = [];

                for (var j = 0; j < this.rings[i].pattern.length; ++j)
                    this.savedState[name][i].pattern[j] = this.rings[i].pattern[j];

                this.savedState[name][i].phase = this.rings[i].phase;
            }
        },

        loadState: function(name) {
            this.rings = [];
            this.players = [];

            for (var i = 0; i < this.savedState[name].length; ++i) {
                var steps = this.savedState[name][i].steps;
                var instrumentIndex = this.savedState[name][i].instrumentIndex;
                var color = this.savedState[name][i].color;

                this.rings.push(
                    new this.ring(
                        steps,
                        instrumentIndex,
                        color
                    )
                );

                for (var j = 0; j < this.savedState[name][i].pattern.length; ++j)
                    this.rings[i].pattern[j] = this.savedState[name][i].pattern[j];

                this.rings[i].phase = this.savedState[name][i].phase;

                this.players.push(new Tone.Player(
                    this.instruments[instrumentIndex].audio
                ).toDestination())
            }
        },

        normalizeAngle: function(angle) {
            while (angle < 0) angle += 2 * Math.PI;
            while (angle > 2 * Math.PI) angle -= 2 * Math.PI;
            return angle;
        },

        enableScroll: function() {
            document.removeEventListener("wheel", this.preventDefault, false);
        },

        disableScroll: function() {
            document.addEventListener("wheel", this.preventDefault, {
                passive: false
            });
        },

        preventDefault: function(e) {
            e = e || window.event;
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false;
        },

        drawClear: function() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },

        drawHand: function(center, angle, length, width) {
            this.context.beginPath();

            const oldLineWidth = this.context.lineWidth;
            this.context.lineWidth = width;

            const oldLineCap = this.context.lineCap;
            this.context.lineCap = "round";

            this.context.strokeStyle = "red";

            this.context.moveTo(center.x, center.y);
            this.context.lineTo(
                center.x + length * Math.cos(angle - Math.PI / 2),
                center.y + length * Math.sin(angle - Math.PI / 2)
            );

            this.context.stroke();

            //restoring
            this.context.lineWidth = oldLineWidth;
            this.context.lineCap = oldLineCap;
        },
        point: function(x, y) {
            this.x = x;
            this.y = y;
        },
        track_mouse: function(e) {
            var target = e.currentTarget;
            var mousePos = this.getMousePos(target, e);

            this.checkMousePos(mousePos);
        },

        click_mouse: function(e) {
            var target = e.currentTarget;
            var mousePos = this.getMousePos(target, e);

            this.doTasks(mousePos);
        },

        wheel_mouse: function(e) {
            var target = e.currentTarget;
            var mousePos = this.getMousePos(target, e);
            var amount = -e.deltaY / 1000;

            this.rotateRings(mousePos, amount);
        },

        getMousePos: function(canvas, evt) {
            var rect = this.canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        },

        ring: function ring(steps, instrumentIndex, color) {
            this.steps = steps;
            this.instrumentIndex = instrumentIndex;
            this.color = color;
            this.pattern = [];

            this.lastStep = -1;
            this.phase = 0;

            for (var i = 0; i < steps; ++i) this.pattern.push(0);
        },

        resetLastStep: function() {
            for (var i = 0; i < this.rings.length; ++i) this.rings[i].lastStep = -1;
        },

        distanceBetween2Points: function(point1, point2) {
            var dx = point2.x - point1.x;
            var dy = point2.y - point1.y;
            return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        },

        angleBetween2Points: function(point1, point2) {
            var dx = point2.x - point1.x;
            var dy = point2.y - point1.y;
            return Math.atan2(dy, dx);
        },

        angleDiff: function(startAngle, endAngle) {
            var angleDiff = startAngle - endAngle;
            angleDiff +=
                angleDiff > Math.PI ?
                -2 * Math.PI :
                angleDiff < -Math.PI ?
                2 * Math.PI :
                0;
            return angleDiff;
        },

        currentStep: function(i) {
            return (
                Math.floor(
                    (this.normalizeAngle(this.currentDegree - this.rings[i].phase) / 2 / Math.PI) *
                    this.rings[i].steps
                ) % this.rings[i].steps
            );
        },

        delta: function(i) {
            return (2 * Math.PI) / this.rings[i].steps;
        },

        isInside: function(i, pos) {
            // http://stackoverflow.com/questions/6270785/how-to-determine-whether-a-point-x-y-is-contained-within-an-arc-section-of-a-c
            // Angle = arctan(y/x); Radius = sqrt(x * x + y * y);
            var radius = this.distanceBetween2Points(pos, this.center);
            // we calculate atan only if the radius is OK
            if (radius >= this.minRadius(i) && radius <= this.maxRadius(i)) {
                var angle = this.angleBetween2Points(this.center, pos);

                angle += Math.PI / 2 - this.rings[i].phase;

                var a = this.normalizeAngle(angle);

                var delta = this.delta(i);

                for (var j = 0; i < this.rings[i].steps; ++j) {
                    var sa = j * delta - Math.PI / 2;
                    var ea = (j + 1) * delta + Math.PI / 90;

                    if (ea < sa) ea += 2 * Math.PI;

                    if (a >= sa && a <= ea) {
                        return j;
                    }
                }
            }
            return -1;
        },

        init: function(minRadius, width, distance, audioPack, canvas, document) {
            this.canvas = canvas;
            this.document = document;

            this.center = new this.point(
                this.canvas.width / 2,
                this.canvas.height / 2
            );

            this.absMinRadius = minRadius;
            this.width = width;
            this.distance = distance;

            this.context = this.canvas.getContext("2d");

            this.canvas.addEventListener("mousemove", this.track_mouse, false);
            this.canvas.addEventListener("click", this.click_mouse, false);
            this.canvas.addEventListener("wheel", this.wheel_mouse, false);

            for (var i = 0; i < audioPack.length; ++i)
                this.addInstrument(audioPack[i].instrument, audioPack[i].audio);

            setInterval(function() {
                if (app.playPause) {
                    app.currentDegree += app.speed / 100;

                    if (app.currentDegree >= 2 * Math.PI) {
                        app.currentDegree = 0;
                        app.resetLastStep();
                    }

                    app.playSound();
                }
            }, 10);

            this.draw();
        },

        changeSteps: function(ring, steps) {
            this.rings[ring].steps = steps;
        },

        rotateRings: function(mousePos, amount) {
            for (var i = 0; i < this.rings.length; ++i) {
                if (this.isInside(i, mousePos) >= 0) {
                    this.rings[i].phase += amount;
                    if (this.rings[i].phase < 0) this.rings[i].phase += 2 * Math.PI;
                    if (this.rings[i].phase > 2 * Math.PI)
                        this.rings[i].phase -= 2 * Math.PI;
                }
            }

            this.checkMousePos(i, mousePos);
        },

        playSound: function() {
            for (var i = 0; i < this.rings.length; ++i) {
                var step = this.currentStep(i);

                if (this.rings[i].pattern[step] && step != this.rings[i].lastStep) {
                    this.rings[i].lastStep = step;
                    this.players[i].start();
                }
            }
        },

        play: function() {
            this.playPause = 1;
        },

        pause: function() {
            this.playPause = 0;
        },

        getStatus: function() {
            return this.playPause;
        },

        changeRingSteps: function(ring, steps) {
            if (steps == 1) {
                Vue.set(this.rings[ring], "steps", this.rings[ring].steps + 1);
                this.rings[ring].pattern.push(0);
                return;
            }

            if (steps == 0) {
                if (this.rings[ring].steps > 1) {
                    Vue.set(this.rings[ring], "steps", this.rings[ring].steps - 1);
                    this.rings[ring].pattern = this.rings[ring].pattern.splice(
                        0,
                        this.rings[ring].steps
                    );
                }
                return;
            }

            if (steps < this.rings[ring].steps)
                this.rings[ring].pattern = this.rings[ring].pattern.splice(0, steps);
            else
                for (var i = 0; i < steps - this.rings[ring].steps; ++i)
                    this.rings[ring].pattern.push(0);

            //this.rings[ring].steps = steps
            Vue.set(this.rings[ring], "steps", steps);
        },

        changeRingColor: function(ring, color) {
            this.rings[ring].color = color;
        },

        changeRingInstrument: function(ring, instrument) {
            this.rings[ring].instrumentIndex = this.instruments.indexOf(instrument);
            this.players[ring] = new Tone.Player(
                instrument.audio
            ).toDestination();
        },

        addInstrument: function(name, audio) {
            this.instruments.push({
                name: name,
                audio: audio
            });
        },

        selectRing: function(ring) {
            if (ring == null)
                return;

            this.selectedInstrument = this.instruments[
                this.rings[this.selectedRing - 1].instrumentIndex
            ];
            this.selectedColor = this.rings[this.selectedRing - 1].color;
        },

        deleteRing: function(ring) {
            this.rings[ring] = null;
            this.players[ring] = null
            this.rings.splice(ring, 1);
            this.players.splice(ring, 1)
        },

        addRing: function(steps, instrument, color) {
            this.rings.push(
                new this.ring(
                    steps,
                    instrument,
                    color
                )
            );

            this.players.push(new Tone.Player(this.instruments[instrument].audio).toDestination())
        },

        draw: function() {
            const maxRadius = this.maxRadius(this.rings.length - 1);

            if (this.rings.length > 0) {
                this.drawClear();
                this.drawRings();
                this.drawHand(this.center, this.currentDegree, maxRadius, 10);
            }

            window.requestAnimationFrame(app.draw);
        },

        minRadius: function(i) {
            return this.absMinRadius + (this.width + this.distance) * i;
        },

        maxRadius: function(i) {
            return this.minRadius(i) + this.width;
        },

        drawRings: function() {
            for (var i = 0; i < this.rings.length; ++i) {
                const stepHighlighted =
                    this.ringHighlighted == i ? this.stepHighlighted : -1;

                const minRadius = this.minRadius(i);
                const maxRadius = this.maxRadius(i);

                const radAvg = (maxRadius + minRadius) / 2;

                const delta = this.delta(i);
                const phase = this.rings[i].phase;
                const pattern = this.rings[i].pattern;
                const color = this.rings[i].color;
                const steps = this.rings[i].steps;

                this.context.lineWidth = maxRadius - minRadius;

                for (var j = 0; j < steps; ++j) {
                    const nColor = pattern[j] ? color : "grey";
                    this.context.strokeStyle =
                        stepHighlighted == j ? "dark" + nColor : nColor;
                    this.context.beginPath();

                    const sa = this.normalizeAngle(j * delta - Math.PI / 2 + phase);
                    const ea = this.normalizeAngle(
                        (j + 1) * delta - Math.PI / 2 - Math.PI / 90 + phase
                    );

                    this.context.arc(this.center.x, this.center.y, radAvg, sa, ea);

                    this.context.stroke();
                }
            }
        },

        doTasks: function(mousePos) {
            for (var i = 0; i < this.rings.length; ++i) {
                const res = this.isInside(i, mousePos);

                if (res >= 0) {
                    this.rings[i].pattern[res] = 1 - this.rings[i].pattern[res];
                }
            }
        },

        checkMousePos: function(mousePos) {
            this.lastRingHighlighted = this.ringHighlighted;
            this.lastStepHighlighted = this.stepHighlighted;
            this.ringHighlighted = null;
            this.stepHighlighted = null;

            for (var i = 0; i < this.rings.length; ++i) {
                const res = this.isInside(i, mousePos);

                if (res >= 0) {
                    this.ringHighlighted = i;
                    this.stepHighlighted = res;
                    //this.rings[i].draw(res);
                }
            }

            /* if (
                                this.lastStepHighlighted != null &&
                                this.ringHighlighted != this.lastRingHighlighted
                              )
                                this.rings[this.lastRingHighlighted].draw(-1);*/

            // set cursor according to the highlight status
            this.canvas.style.cursor =
                this.ringHighlighted != null ? "pointer" : "default";
        }
    }
});

window.app = app;

const audioPack = [{
        instrument: "gong 1",
        audio: "https://tonejs.github.io/audio/berklee/gong_1.mp3"
    },
    {
        instrument: "gong 2",
        audio: "https://tonejs.github.io/audio/berklee/gong_2.mp3"
    },
    {
        instrument: "shaker 1",
        audio: "https://tonejs.github.io/audio/berklee/shaker_1.mp3"
    },
    {
        instrument: "male voices",
        audio: "https://tonejs.github.io/audio/berklee/malevoices_aa2_F3.mp3"
    }
];

//user interaction
app.init(50, 25, 10, audioPack, app.$refs.myCanvas, document);

for (var i = 0; i < 4; ++i) app.addRing(8, 0, "red");