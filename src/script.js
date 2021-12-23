import Vue from 'vue';
import vSelect from "vue-select";
import * as Tone from '../node_modules/tone/build/Tone';
import 'regenerator-runtime/runtime'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { firebase } from '@firebase/app'
import "firebase/firestore"

Vue.component("v-select", vSelect);
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

const firebaseConfig = {
    apiKey: "AIzaSyDPUyE70m9dh1gMZJkGwjtIht1Ig6tMysU",
    authDomain: "rhythmwheel.firebaseapp.com",
    projectId: "rhythmwheel",
    storageBucket: "rhythmwheel.appspot.com",
    messagingSenderId: "269684546616",
    appId: "1:269684546616:web:b0f918b004d3ef00dd5acd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db.collection("states").onSnapshot(dbCallback);

function dbCallback(snapshot) {
    app.states = [];
    snapshot.docs.forEach((doc) => app.states.push({
        id: doc.id,
        ...doc.data(),
    }));
    app.states.push({ name: "Add New" });
};

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
        states: [],
        numeroMaxRings: 8,
        numeroMaxSteps: 16,
        showAddState: false,
        random: [],
        pn: null,
        mss: null,
        c: null
    },
    methods: {
        reset: function() {
            this.pause()

            for (var i = 0; i < this.rings.length; ++i)
                this.rings[i] = null

            this.rings = []

            for (var i = 0; i < this.players.length; ++i)
                this.players[i].stop()
            this.players[i] = null
            this.players = []
        },

        randomPoolFiller: async function() {
            this.c = new AudioContext();

            var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mss = this.c.createMediaStreamSource(stream);

            this.pn = this.c.createScriptProcessor(1024, 1, 1);
            this.pn.onaudioprocess = function(event) {
                if (app.random.length < 10000)
                    app.random.push(event.inputBuffer.getChannelData(0).slice());
            };
            this.mss.connect(this.pn);
            //this.pn.connect(this.c.destination);
        },

        getRandom: function() {
            var x = 0
            var numbers = null

            if (this.random.length < 1)
                return Math.random()

            while (x == 0) {
                numbers = this.random.reverse().pop()

                if (numbers == undefined) {
                    console.log("Empty random pool, returning pseudorandom")
                    return Math.random()
                }

                this.random.reverse()

                for (var i = 0; i < numbers.length; ++i)
                    x += numbers[i]

                x = Math.abs(x) % 1
            }

            return x
        },

        randomize: function() {
            this.reset()

            let rings = prompt("Number of rings (max " + this.numeroMaxRings + ") (null to randomize):", "");
            if (rings == null) {
                rings = 0
                while (rings < 1)
                    rings = Math.round(this.getRandom() * this.numeroMaxRings)
            } else if (isNaN(rings) || rings < 1 || rings > this.numeroMaxRings) {
                alert("Invalid value");
                return;
            }

            let p = prompt("Step filling probability (btw 0 and 1) (null to randomize for each ring):", "");
            if (p != null && (isNaN(p) || p < 0 || p > 1)) {
                alert("Invalid value");
                return;
            }

            for (var i = 0; i < rings; ++i) {
                p = this.getRandom()

                var steps = Math.round(this.getRandom() * this.numeroMaxSteps);

                while (steps < 1)
                    steps = Math.round(this.getRandom() * this.numeroMaxSteps)

                const instrument = Math.round(this.getRandom() * (this.instruments.length - 1));

                const color = this.colors[Math.round(this.getRandom() * (this.colors.length - 1))];

                this.rings.push(
                    new this.ring(
                        steps,
                        instrument,
                        color
                    )
                );

                for (var j = 0; j < steps; ++j)
                    this.rings[i].pattern[j] = this.getRandom() < p ? 1 : 0

                this.rings[i].phase = this.getRandom() * 2 * Math.PI

                this.players.push(new Tone.Player(
                    this.instruments[instrument].audio
                ).toDestination())
            }
        },

        range: function(start, stop, step) {
            step = step || 1;
            var arr = [];
            for (var i = start; i < stop; i += step) {
                arr.push(i);
            }
            arr.push(stop);
            return arr;
        },

        uploadNewState: function(name) {
            let state = {}
            state.name = name.trim()
            state.rings = []

            this.showAddState = false;

            db.collection("states").add(state)
                .then(function(docRef) {
                    docRef.get().then(function(snap) {
                        app.selectedState.id = snap.id
                        app.saveState(snap.id)
                        app.selectedState.name = snap.data().name
                        app.selectedState.rings = snap.data().rings
                    })
                })
                .catch(function() {
                    alert("Internal error: can't upload state to database")
                });
        },

        deleteState: function(event, id) {
            const documentReference = db.collection("states").doc(id);
            documentReference.delete();

            this.selectedState = null
            this.$refs["stateSelector"].clearSelection()
            event.stopPropagation()
        },

        saveState: function(id) {
            const documentReference = db.collection("states").doc(id);

            const rings = []

            for (var i = 0; i < this.rings.length; ++i) {
                rings.push({})

                rings[i].steps = this.rings[i].steps;
                rings[i].instrument = this.rings[i].instrument;
                rings[i].color = this.rings[i].color;

                rings[i].pattern = [];

                for (var j = 0; j < this.rings[i].pattern.length; ++j)
                    rings[i].pattern[j] = this.rings[i].pattern[j];

                rings[i].phase = this.rings[i].phase;
            }

            documentReference.update({ rings: rings });
            alert('State saved with success!');
        },

        loadState: function(state) {
            this.reset()

            for (var i = 0; i < state.length; ++i) {
                var steps = state[i].steps;
                var instrument = state[i].instrument;
                var color = state[i].color;

                this.rings.push(
                    new this.ring(
                        steps,
                        instrument,
                        color
                    )
                );

                for (var j = 0; j < state[i].pattern.length; ++j)
                    this.rings[i].pattern[j] = state[i].pattern[j];

                this.rings[i].phase = state[i].phase;

                this.players.push(new Tone.Player(
                    this.instruments[instrument].audio
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

        ring: function ring(steps, instrument, color) {
            this.steps = steps;
            this.instrument = instrument;
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
            var radius = this.distanceBetween2Points(pos, this.center);

            if (radius >= this.minRadius(i) && radius <= this.maxRadius(i)) {
                var angle = this.angleBetween2Points(this.center, pos);

                angle += Math.PI / 2 - this.rings[i].phase;

                var a = this.normalizeAngle(angle);

                var delta = this.delta(i);

                for (var j = 0; j < this.rings[i].steps; ++j) {
                    var sa = j * delta;
                    var ea = (j + 1) * delta;

                    if (ea < sa) ea += 2 * Math.PI;

                    if (a >= sa && a <= ea) {
                        return j;
                    }
                }
            }

            return -1;
        },

        init: async function(minRadius, width, distance, audioPack, canvas, document) {
            this.canvas = canvas;
            this.document = document;

            this.absMinRadius = minRadius;
            this.width = width;
            this.distance = distance;

            this.context = this.canvas.getContext("2d");

            this.canvas.width = 700
            this.canvas.height = 700

            this.center = new this.point(
                this.canvas.width / 2,
                this.canvas.height / 2
            );

            this.canvas.addEventListener("mousemove", this.track_mouse, false);
            this.canvas.addEventListener("click", this.click_mouse, false);
            this.canvas.addEventListener("wheel", this.wheel_mouse, false);

            for (var i = 0; i < audioPack.length; ++i)
                this.addInstrument(audioPack[i].instrument, audioPack[i].audio);

            setInterval(function() {
                if (app.playPause) {
                    app.currentDegree += 2 * 2 * Math.PI * app.speed / 100 / 60;

                    if (app.currentDegree >= 2 * Math.PI) {
                        app.currentDegree = 0;
                        app.resetLastStep();
                    }

                    app.playSound();
                }
            }, 10);

            this.draw();
            await this.randomPoolFiller();
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

        canChangeRingSteps: function(ring, mode) {
            if (ring == null)
                return false
            else if (this.rings[ring - 1].steps == 1 && mode == 0)
                return false
            else if (this.rings[ring - 1].steps == this.numeroMaxSteps && mode == 1)
                return false
            return true
        },

        changeRingSteps: function(ring, steps) {
            if (steps == 1) {
                Vue.set(this.rings[ring], "steps", this.rings[ring].steps + 1);
                this.rings[ring].pattern.push(0);
            }

            if (steps == 0) {
                if (this.rings[ring].steps > 1) {
                    Vue.set(this.rings[ring], "steps", this.rings[ring].steps - 1);
                    this.rings[ring].pattern = this.rings[ring].pattern.splice(
                        0,
                        this.rings[ring].steps
                    );
                }
            }
        },

        changeRingColor: function(ring, color) {
            this.rings[ring].color = color;
        },

        changeRingInstrument: function(ring, instrument) {
            this.rings[ring].instrument = this.instruments.indexOf(instrument);
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
                this.rings[this.selectedRing - 1].instrument
            ];
            this.selectedColor = this.rings[this.selectedRing - 1].color;
        },

        deleteRing: function(event, ring) {
            if (ring == null)
                return;

            this.rings[ring] = null;
            this.players[ring] = null
            this.rings.splice(ring, 1);
            this.players.splice(ring, 1)

            this.selectedRing = null
            event.stopPropagation()
        },

        addRing: function(steps, instrument, color) {
            if (steps == null) {
                steps = prompt("Number of steps:", "");
                if (steps == null || isNaN(steps) || steps < 1) {
                    alert("Invalid value");
                    return;
                }
            }

            if (instrument == null) {
                //IMPROVE
                instrument = prompt("Instrument:", "");
                if (instrument == null || isNaN(instrument)) {
                    alert("Invalid value");
                    return;
                }
            }

            if (color == null) {
                color = prompt("Color:", "");
                if (color == null || color.trim() == "") {
                    alert("Invalid value");
                    return;
                }
            }

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

            this.drawClear();

            if (this.rings.length > 0) {
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
                }
            }

            // set cursor according to the highlight status
            this.canvas.style.cursor =
                this.ringHighlighted != null ? "pointer" : "default";
        },

        createNewState: function() {
            let stateName = prompt("Please enter the new state name:", "");
            if (stateName == null || stateName == "") {
                alert("Error: You can't create a state with an empty name!");
            } else {
                this.uploadNewState(stateName)
            }
        }
    }
});

window.app = app;

const audioPack = [{
        instrument: "gong 1",
        audio: require('./resources/audio/gong_1.mp3')
    },
    {
        instrument: "gong 2",
        audio: require('./resources/audio/gong_2.mp3')
    },
    {
        instrument: "shaker 1",
        audio: require('./resources/audio/shaker_1.mp3')
    },
    {
        instrument: "male voices",
        audio: require('./resources/audio/malevoices_aa2_F3.mp3')
    },
    {
        instrument: "Closed Hi Hats",
        audio: require('./resources/audio/cl_hihat.wav')
    },
    {
        instrument: "Claves",
        audio: require('./resources/audio/claves.wav')
    },
    {
        instrument: "Conga",
        audio: require('./resources/audio/conga1.wav')
    },
    {
        instrument: "Cowbell",
        audio: require('./resources/audio/cowbell.wav')
    },
    {
        instrument: "Crash Cymbals",
        audio: require('./resources/audio/crashcym.wav')
    },
    {
        instrument: "Hand Clap",
        audio: require('./resources/audio/handclap.wav')
    },
    {
        instrument: "Hi Conga",
        audio: require('./resources/audio/hi_conga.wav')
    },
    {
        instrument: "High Tom",
        audio: require('./resources/audio/hightom.wav')
    },
    {
        instrument: "Kick 1",
        audio: require('./resources/audio/kick1.wav')
    },
    {
        instrument: "Kick 2",
        audio: require('./resources/audio/kick2.wav')
    },
    {
        instrument: "Maracas",
        audio: require('./resources/audio/maracas.wav')
    },
    {
        instrument: "Open Hi Hats",
        audio: require('./resources/audio/open_hh.wav')
    },
    {
        instrument: "Rimshot",
        audio: require('./resources/audio/rimshot.wav')
    },
    {
        instrument: "Snare",
        audio: require('./resources/audio/snare.wav')
    },
    {
        instrument: "Tom 1",
        audio: require('./resources/audio/tom1.wav')
    }
];

app.init(50, 25, 10, audioPack, app.$refs.myCanvas, document);
for (var i = 0; i < 4; ++i) app.addRing(8, 0, "red");