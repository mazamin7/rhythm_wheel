/*jshint esversion: 9 */
import Vue from 'vue';
import vSelect from "vue-select";
import * as Tone from '../node_modules/tone/build/Tone';
import 'regenerator-runtime/runtime';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import { firebase } from '@firebase/app';
import "firebase/firestore";

const Color = require('color');

Vue.component("v-select", vSelect);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

//808 Basic DRUM MACHINE
import gong_1 from 'url:./resources/audio/808/gong_1.mp3';
import gong_2 from 'url:./resources/audio/808/gong_2.mp3';
import shaker_1 from 'url:./resources/audio/808/shaker_1.mp3';
import malevoices_aa2_F3 from 'url:./resources/audio/808/malevoices_aa2_F3.mp3';
import cl_hihat from 'url:./resources/audio/808/cl_hihat.wav';
import claves from 'url:./resources/audio/808/claves.wav';
import conga1 from 'url:./resources/audio/808/conga1.wav';
import cowbell from 'url:./resources/audio/808/cowbell.wav';
import crashcym from 'url:./resources/audio/808/crashcym.wav';
import handclap from 'url:./resources/audio/808/handclap.wav';
import hi_conga from 'url:./resources/audio/808/hi_conga.wav';
import hightom from 'url:./resources/audio/808/hightom.wav';
import kick1 from 'url:./resources/audio/808/kick1.wav';
import kick2 from 'url:./resources/audio/808/kick2.wav';
import maracas from 'url:./resources/audio/808/maracas.wav';
import open_hh from 'url:./resources/audio/808/open_hh.wav';
import rimshot from 'url:./resources/audio/808/rimshot.wav';
import snare from 'url:./resources/audio/808/snare.wav';
import tom1 from 'url:./resources/audio/808/tom1.wav';

//909 Extended DRUM MACHINE
import clap1 from 'url:./resources/audio/909/909-Clap-1.wav';
import clap2 from 'url:./resources/audio/909/909-Clap-1.wav';
import crash0 from 'url:./resources/audio/909/909-Crash-HD0.wav';
import crash2 from 'url:./resources/audio/909/909-Crash-HD2.wav';
import crash4 from 'url:./resources/audio/909/909-Crash-HD4.wav';
import hhClosed0 from 'url:./resources/audio/909/909-HiHatClosed-D0.wav';
import hhClosed2 from 'url:./resources/audio/909/909-HiHatClosed-D2.wav';
import hhClosed4 from 'url:./resources/audio/909/909-HiHatClosed-D4.wav';
import hhClosed6 from 'url:./resources/audio/909/909-HiHatClosed-D6.wav';
import hhClosed8 from 'url:./resources/audio/909/909-HiHatClosed-D8.wav';
import hhClosedA from 'url:./resources/audio/909/909-HiHatClosed-DA.wav';
import hhOpen0 from 'url:./resources/audio/909/909-HiHatOpen-D0.wav';
import hhOpen1 from 'url:./resources/audio/909/909-HiHatOpen-D2.wav';
import hhOpen2 from 'url:./resources/audio/909/909-HiHatOpen-D4.wav';
import kick0 from 'url:./resources/audio/909/909-Kick-T0A0A7.wav';
import kick3 from 'url:./resources/audio/909/909-Kick-T0A0D0.wav';
import kick4 from 'url:./resources/audio/909/909-Kick-T0A0D3.wav';
import kick5 from 'url:./resources/audio/909/909-Kick-T0A0DA.wav';
import snare0 from 'url:./resources/audio/909/909-Snare-T0T0S0.wav';
import snare1 from 'url:./resources/audio/909/909-Snare-T0T0S3.wav';
import snare2 from 'url:./resources/audio/909/909-Snare-T0T0S7.wav';
import snare3 from 'url:./resources/audio/909/909-Snare-T0T0SA.wav';
import snare4 from 'url:./resources/audio/909/909-Snare-T0T0SA.wav';



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
}

var app = new Vue({
    el: "#app",
    data: {
        rings: [],
        players: [],
        gains: [],
        ringHighlighted: null,
        stepHighlighted: null,
        lastRingHighlighted: null,
        lastStepHighlighted: null,
        instruments: [],
        center: null,
        absMinRadius: null,
        width: null,
        distance: null,
        canvas: null,
        context: null,
        currentDegree: 0,
        flip: 0,
        speed: 10,
        playPause: 0,
        selectedRing: null,
        selectedInstrument: null,
        selectedNewInstrument: null,
        selectedColor: null,
        selectedNewColor: null,
        selectedState: null,
        selectedSteps: null,
        selectedVolume: 0,
        stateName: null,
        colors: ["red", "orange", "yellow", "green", "blue", "purple"],
        document: null,
        states: [],
        numeroMaxRings: 8,
        numeroMaxSteps: 16,
        showAddState: false,
        random: [],
        pn: null,
        mss: null,
        c: null,
        showNewRings: false,
        showNewInstruments: false,
        showNewColor: false,
        showRandomRings: false,
        selectedRandomRings: null,
        selectedRandomProbability: null,
        showRandomProbability: false,
        showNewState: false,
        newStateName: null,
        showStateSaved: false,
        showRingAdded: false,
        showRandomCreated: false,
        showRandomVolume: false,
        showRandomPhase: false,
        randomizeVolume: false,
        randomizePhase: false,
        showNewStateCreated: false,
        showDownloadedState: false
    },
    methods: {
        reset: function() {
            this.pause()
            this.currentDegree = 0
            this.flip = 0

            for (var i = 0; i < this.rings.length; i += 1) {
                this.rings[i] = null;
            }

            this.rings = []

            for (var i = 0; i < this.players.length; i += 1) {
                this.players[i].stop()
                this.players[i] = null
                this.gains[i] = null
            }
            this.gains = []
            this.players = []
        },

        randomPoolFiller: async function() {
            this.c = new AudioContext();

            var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mss = this.c.createMediaStreamSource(stream);

            this.pn = this.c.createScriptProcessor(1024, 1, 1);
            this.pn.onaudioprocess = function(event) {
                if (app.random.length < 100) {
                    app.random.push(event.inputBuffer.getChannelData(0).slice());
                }
            };
            this.mss.connect(this.pn);
        },

        getRandom: function() {
            var x = 0
            var numbers = null

            if (this.random.length < 1) {
                console.log("Empty random pool, returning pseudorandom number")
                return Math.random()
            }

            while (x == 0) {
                numbers = this.random.reverse().pop()

                if (numbers == undefined) {
                    console.log("Empty random pool, returning pseudorandom number")
                    return Math.random()
                }

                this.random.reverse()

                for (var i = 0; i < numbers.length; i += 1) {
                    x += numbers[i] * 1000;
                }

                x = Math.abs(x) % 1
            }

            console.log("Returning noise generated random number")
            return x
        },

        randomize: function(phase, volume) {
            this.reset()
            const rings = this.selectedRandomRings
            const p = this.selectedRandomProbability
            this.selectedRandomRings = null
            this.selectedRandomProbability = null

            for (var i = 0; i < rings; i += 1) {
                const steps = Math.round(this.getRandom() * (this.numeroMaxSteps - 2)) + 2;

                const instrument = Math.round(this.getRandom() * (this.instruments.length - 1));

                const color = this.colors[Math.round(this.getRandom() * (this.colors.length - 1))];

                this.addRing(steps, instrument, color)

                for (var j = 0; j < steps; j += 1) {
                    if (this.getRandom() < p) {
                        this.rings[i].pattern[j] = Math.round(this.getRandom()) + 1;
                    } else {
                        this.rings[i].pattern[j] = 0;
                    }
                }

                if (phase == true) {
                    this.rings[i].phase = this.getRandom() * 2 * Math.PI;
                } else {
                    this.rings[i].phase = 0;
                }

                if (volume == true) {
                    this.rings[i].volume = -Math.round(2 * this.getRandom() * 30) / 2;
                } else {
                    this.rings[i].volume = 0;
                }

                this.selectedRandomRings = null;
                this.selectedRandomProbability = null;
                this.selectedRing = null;
                this.selectedState = null;
                window.location.href = "#canvas";
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
            state.name = name.trim().slice(0, 16)
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

            window.location.href = "#canvas";
        },

        deleteState: function(event, id) {
            const documentReference = db.collection("states").doc(id);
            documentReference.delete();

            this.selectedState = null
            this.$refs.stateSelector.clearSelection()
            event.stopPropagation()
        },

        saveState: function(id) {
            const documentReference = db.collection("states").doc(id);

            const rings = []

            for (var i = 0; i < this.rings.length; i += 1) {
                rings.push({})

                rings[i].steps = this.rings[i].steps;
                rings[i].instrument = this.rings[i].instrument;
                rings[i].color = this.rings[i].color;

                rings[i].pattern = [];

                for (var j = 0; j < this.rings[i].pattern.length; j += 1) {
                    rings[i].pattern[j] = this.rings[i].pattern[j];
                }

                rings[i].phase = this.rings[i].phase;
                rings[i].volume = this.rings[i].volume
            }

            documentReference.update({ rings: rings });
            window.location.href = "#canvas";
        },

        loadState: function(state) {
            this.reset()

            for (var i = 0; i < state.length; i += 1) {
                const steps = state[i].steps;
                const instrument = state[i].instrument;
                const color = state[i].color;

                this.addRing(steps, instrument, color)

                for (var j = 0; j < state[i].pattern.length; j += 1) {
                    this.rings[i].pattern[j] = state[i].pattern[j];
                }

                this.rings[i].phase = state[i].phase;
                this.rings[i].volume = state[i].volume
            }
        },

        normalizeAngle: function(angle) {
            while (angle < 0) {
                angle += 2 * Math.PI;
            }
            while (angle > 2 * Math.PI) {
                angle -= 2 * Math.PI;
            }
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
            var amount = -e.deltaY / 1000 * Math.PI / 16;

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
            this.volume = 0

            for (var i = 0; i < steps; i += 1) {
                this.pattern.push(0);
            }
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

                for (var j = 0; j < this.rings[i].steps; j += 1) {
                    var sa = j * delta;
                    var ea = (j + 1) * delta;

                    if (ea < sa) {
                        ea += 2 * Math.PI;
                    }

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

            for (var i = 0; i < audioPack.length; i += 1) {
                this.addInstrument(audioPack[i].instrument, audioPack[i].audio);
            }

            setInterval(function() {
                if (app.playPause) {
                    app.currentDegree += 2 * Math.PI * app.speed / 2000;

                    if (app.currentDegree >= 2 * Math.PI) {
                        app.currentDegree = 0;
                        app.flip = 1 - app.flip
                    }

                    app.playSound();
                }
            }, 20);

            this.draw();
            await this.randomPoolFiller();
        },

        rotateRings: function(mousePos, amount) {
            for (var i = 0; i < this.rings.length; i += 1) {
                if (this.isInside(i, mousePos) >= 0) {
                    this.rings[i].phase += amount;
                    if (this.rings[i].phase < 0) {
                        this.rings[i].phase += 2 * Math.PI;
                    }
                    if (this.rings[i].phase > 2 * Math.PI) {
                        this.rings[i].phase -= 2 * Math.PI;
                    }
                }
            }

            this.checkMousePos(i, mousePos);
        },

        playSound: function() {
            for (var i = 0; i < this.rings.length; i += 1) {
                var step = this.currentStep(i);

                if (this.rings[i].pattern[step] > 0 && step != this.rings[i].lastStep) {
                    this.rings[i].lastStep = step;
                    if (this.rings[i].pattern[step] == 1) {
                        this.gains[i].volume.value = this.rings[i].volume - 10;
                    } else if (this.rings[i].pattern[step] == 2) {
                        this.gains[i].volume.value = this.rings[i].volume - 5;
                    }
                    this.players[i].start();
                } else if (step != this.rings[i].lastStep) {
                    this.rings[i].lastStep = step;
                }
            }
        },

        play: function() {
            this.playPause = 1;
            window.location.href = "#canvas";
        },

        pause: function() {
            this.playPause = 0;
        },

        getStatus: function() {
            return this.playPause;
        },

        canChangeRingSteps: function(ring, mode) {
            if (ring == null || ring < 1) {
                return false;
            } else if (this.rings[ring - 1].steps < 3 && mode == 0) {
                return false;
            } else if (this.rings[ring - 1].steps == this.numeroMaxSteps && mode == 1) {
                return false;
            }
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

        changeRingVolume: function(ring, volume) {
            if (volume > 0) {
                return;
            }

            this.rings[ring].volume = volume
        },

        changeRingInstrument: function(ring, instrument) {
            this.rings[ring].instrument = this.instruments.indexOf(instrument);
            this.players[ring] = new Tone.Player(
                instrument.audio
            ).connect(this.gains[ring]);
        },

        selectNewInstrument: function() {
            this.selectedNewInstrument = this.instruments.indexOf(this.selectedNewInstrument);
            this.showNewColor = true;
            this.showNewInstruments = false;
        },

        addInstrument: function(name, audio) {
            this.instruments.push({
                name: name,
                audio: audio
            });
        },

        selectRing: function(ring) {
            if (ring == null) {
                return;
            }

            this.selectedInstrument = this.instruments[
                this.rings[this.selectedRing - 1].instrument
            ];
            this.selectedColor = this.rings[this.selectedRing - 1].color;
            this.selectedVolume = this.rings[this.selectedRing - 1].volume;
        },

        deleteRing: function(event, ring) {
            if (ring == null) {
                return;
            }

            this.rings[ring] = null;
            this.players[ring] = null
            this.gains[ring] = null
            this.rings.splice(ring, 1);
            this.players.splice(ring, 1)
            this.gains.splice(ring, 1)

            this.selectedRing = null
            event.stopPropagation()
        },

        addRing: function(steps, instrument, color) {
            this.rings.push(
                new this.ring(
                    steps,
                    instrument,
                    color
                )
            );

            const vol = new Tone.Volume(-5).toDestination()
            const player = new Tone.Player(this.instruments[instrument].audio).connect(vol)

            this.gains.push(vol)
            this.players.push(player);

            this.selectedNewInstrument = null;
            this.selectedNewColor = null;
            this.selectedSteps = null;
            this.selectedRing = null;
            this.selectedInstrument = null;
            this.selectedColor = null;
            window.location.href = "#canvas";
        },

        draw: function() {
            const maxRadius = this.maxRadius(this.rings.length - 1);

            this.drawClear();

            if (this.rings.length > 0) {
                this.drawRings();
                this.drawHand(this.center, this.currentDegree, maxRadius, 6);
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
            for (var i = 0; i < this.rings.length; i += 1) {
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

                for (var j = 0; j < steps; j += 1) {
                    var colorStr = "grey"
                    if (stepHighlighted == j && pattern[j] == 2) {
                        colorStr = Color(color).darken(0.5);
                    }
                    if (stepHighlighted != j && pattern[j] == 2) {
                        colorStr = Color(color);
                    } else if (stepHighlighted == j && pattern[j] == 1) {
                        colorStr = Color(color).darken(0.5);
                    } else if (stepHighlighted != j && pattern[j] == 1) {
                        colorStr = Color(color).desaturate(0.5);
                    }
                    this.context.strokeStyle = colorStr
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
            for (var i = 0; i < this.rings.length; i += 1) {
                const res = this.isInside(i, mousePos);

                if (res >= 0) {
                    this.rings[i].pattern[res] = (this.rings[i].pattern[res] + 1) % 3;
                }
            }
        },

        checkMousePos: function(mousePos) {
            this.lastRingHighlighted = this.ringHighlighted;
            this.lastStepHighlighted = this.stepHighlighted;
            this.ringHighlighted = null;
            this.stepHighlighted = null;

            for (var i = 0; i < this.rings.length; i += 1) {
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

        createNewState: function(stateName) {
            this.uploadNewState(stateName)
            this.newStateName = null;
        }
    }
});

window.app = app;

const audioPack = [{
        instrument: "Gong 1",
        audio: gong_1
    },
    {
        instrument: "Gong 2",
        audio: gong_2
    },
    {
        instrument: "Shaker 1",
        audio: shaker_1
    },
    {
        instrument: "Male voices",
        audio: malevoices_aa2_F3
    },
    {
        instrument: "Hi Hats Closed 1",
        audio: cl_hihat
    },
    {
        instrument: "Claves",
        audio: claves
    },
    {
        instrument: "Conga",
        audio: conga1
    },
    {
        instrument: "Cowbell",
        audio: cowbell
    },
    {
        instrument: "Crash Cymbals",
        audio: crashcym
    },
    {
        instrument: "Hand Clap",
        audio: handclap
    },
    {
        instrument: "Hi Conga",
        audio: hi_conga
    },
    {
        instrument: "High Tom",
        audio: hightom
    },
    {
        instrument: "Kick 1",
        audio: kick1
    },
    {
        instrument: "Kick 2",
        audio: kick2
    },
    {
        instrument: "Maracas",
        audio: maracas
    },
    {
        instrument: "Hi Hats Open 1",
        audio: open_hh
    },
    {
        instrument: "Rimshot",
        audio: rimshot
    },
    {
        instrument: "Snare 1",
        audio: snare
    },
    {
        instrument: "Tom 1",
        audio: tom1
    },
    {
        instrument: "Clap 1",
        audio: clap1
    },
    {
        instrument: "Clap 2",
        audio: clap2
    },
    {
        instrument: "Crash 1",
        audio: crash0
    },
    {
        instrument: "Crash 2",
        audio: crash2
    },
    {
        instrument: "Crash 3",
        audio: crash4
    },
    {
        instrument: "Hi Hats Closed 2",
        audio: hhClosed0
    },
    {
        instrument: "Hi Hats Closed 3",
        audio: hhClosed2
    },
    {
        instrument: "Hi Hats Closed 4",
        audio: hhClosed4
    },
    {
        instrument: "Hi Hats Closed 5",
        audio: hhClosed6
    },
    {
        instrument: "Hi Hats Closed 6",
        audio: hhClosed8
    },
    {
        instrument: "Hi Hats Closed 7",
        audio: hhClosedA
    },
    {
        instrument: "Hi Hats Open 2",
        audio: hhOpen0
    },
    {
        instrument: "Hi Hats Open 3",
        audio: hhOpen1
    },
    {
        instrument: "Hi Hats Open 4",
        audio: hhOpen2
    },
    {
        instrument: "Kick 3",
        audio: kick0
    },
    {
        instrument: "Kick 4",
        audio: kick3
    },
    {
        instrument: "Kick 5",
        audio: kick4
    },
    {
        instrument: "Kick 6",
        audio: kick5
    },
    {
        instrument: "Snare 2",
        audio: snare0
    },
    {
        instrument: "Snare 3",
        audio: snare1
    },
    {
        instrument: "Snare 3",
        audio: snare2
    },
    {
        instrument: "Snare 4",
        audio: snare3
    }
];

app.init(50, 25, 10, audioPack.sort((a, b) => a.instrument.localeCompare(b.instrument)), app.$refs.myCanvas, document);
for (var i = 0; i < 4; i += 1) {
    app.addRing(8, 0, "blue");
}