
function getKeyByValue(object, value) {return Object.keys(object).find(key => object[key] === value);}

function choose(choices) {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

var notes = JSON.parse('{"C3":130.81,"C#3":138.59,"D3":146.83,"D#3":155.56,"E3":164.81,"F3":174.61,"F#3":185,"G3":196,"G#3":207.65,"A3":220,"A#3":233.08,"B3":246.94,"C4":261.63,"C#4":277.18,"D4":293.66,"D#4":311.13,"E4":329.63,"F4":349.23,"F#4":369.99,"G4":392,"G#4":415.3,"A4":440,"A#4":466.16,"B4":493.88,"C5":523.25,"C#5":554.37,"D5":587.33,"D#5":622.25,"E5":659.26,"F5":698.46,"F#5":739.99,"G5":783.99,"G#5":830.61,"A5":880}')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var listenAgain = true
var difficulty, mode

var diffSelector = document.getElementById('dif')
document.getElementById('n').innerHTML = diffSelector.value;
document.getElementById('n').innerHTML = diffSelector.value;
difficulty = parseInt(diffSelector.value);
diffSelector.oninput = function () {
    document.getElementById('n').innerHTML = diffSelector.value;
    difficulty = parseInt(diffSelector.value);
    
}
function getInput() {
    var modeSelector = document.getElementById('mode')
    modeSelector.oninput = function () {
        mode = modeSelector.querySelector(':checked').value;
    }
}

function setup() {
    getInput()
    switch (mode) {
        case 'easy':
            
            listenAgain = true
            break
        case 'acc':
            
            listenAgain = true
            if (difficulty < 7) difficulty = 7
            else if (difficulty > 10) difficulty = 10
            else { }
            break
        case "mem":
            
            listenAgain = false
            break

    }
}

var playDiv, hz, userHz, note
var play = async function () {
    $('#fd').html("")
    $('#freq').html("")
    setup() // Set up and apply settings
    // Lock button
    document.getElementById('start').onclick = ''
    // Setup variables
    playDiv = document.getElementById('play')
    note = choose(Object.keys(notes))
    hz = Math.round(notes[note])
    userHz = Math.round(Math.random() * 400 + 200)

    // Display intro and play sounds
    playDiv.innerHTML = '3...'
    await sleep(1000); playDiv.innerHTML = "2..."
    await sleep(1000); playDiv.innerHTML = "1..."
    await sleep(1000); playDiv.innerHTML = "GO! "
    await sleep(1000); playDiv.innerHTML = ""
    await sleep(1); playTone(hz, 'sine', 1)
    await sleep(1050); playTone(userHz, 'sine', 1)
    
        // Show controls
    document.getElementById('controls').style.display = 'flex'
}

var inc, dec
// Button logic
$('#minus').mousedown(() => {
    inc = setInterval(() => { changeFreq(-1) }, 200)
}).mouseup(() => { clearInterval(inc) }).click(() => { changeFreq(-1, 1000) })

$('#plus').mousedown(() => {
    dec = setInterval(() => { changeFreq(1) }, 200)
}).mouseup(() => { clearInterval(dec) }).click(() => { changeFreq(1, 1000) })

async function changeFreq(f, d = 200) {
    userHz += f;
    playTone(userHz, 'sine', d / 1000);
    await sleep(d);
    
    
}

async function replay() {
    if (!listenAgain) {
        return
    }
    else {
        playTone(hz, 'sine', 1)
        await sleep(500);
    }
}

function checkNote() {
    $('#controls').css('display', 'none')
    var t = (10 - difficulty) * 2
    if (Math.abs(hz - userHz) < t) {
        $('#fd').text("Great job! You have a very sharp ear!")
    }
    else {
        $('#fd').text('Looks like you need some more practice!')
    }
    var closest = Object.values(notes).reduce((a, b) => {return Math.abs(b - userHz) < Math.abs(a - userHz) ? b : a;})
    $('#freq').html('Computer\'s frequency: ' + note + ' (approximately ' + hz + ' hz)<br>Your frequency: ' + userHz + ' hz (approximately ' + getKeyByValue(notes, closest) + ')')
    // Unlock button at the end
    document.getElementById('start').onclick = play

}

