const canvas = document.querySelector('canvas');
const mktimage = new Image();
let animParam = 0;

mktimage.onload = (event) => {
    animate();
}
mktimage.src = "./markets.png";

function animate() {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.translate(-1, 0);
    ctx.drawImage(mktimage, 0, 0);
    if (animParam < 300) {
        animParam++;
    }
    else {
        animParam = 0;
        ctx.resetTransform();
    }
    requestAnimationFrame(animate);
};

const stream = canvas.captureStream();

// ICE negotiations etc.

remoteOffer.innerText = localAnswer.innerText = "";

offerRecdBtn.onclick = function () {
    var offer = remoteOffer.innerText;
    var offerDesc = new RTCSessionDescription(JSON.parse(offer))
    pc2.setRemoteDescription(offerDesc)
    pc2.createAnswer(function (answerDesc) {
        pc2.setLocalDescription(answerDesc)
    },
        function () { },
        sdpConstraints)
    localAnswerLabel.hidden = false;
    copyToClipboard.disabled = false;
};

var cfg = { 'iceServers': [/*{'url': "stun:stunserver2025.stunprotocol.org"}*/] },
    con = { 'optional': [{ 'DtlsSrtpKeyAgreement': true }] }

var sdpConstraints = {
    optional: [],
}

copyToClipboard.onclick = function () {
    navigator.clipboard.writeText(JSON.stringify(pc2.localDescription));
    idPlacedToClipboard.hidden = false;
}

function sendMessage() {
    if (messageTextBox.value) {
        activedc.send(JSON.stringify({ message: messageTextBox.value }));
        chatlog.innerHTML += '[' + new Date() + '] ' + messageTextBox.value + '</p>';
        messageTextBox.value = "";
    }
    return false
}

var pc2 = new RTCPeerConnection(cfg, con), dc2 = null, pc2icedone = false;

pc2.ondatachannel = function (e) {
    var datachannel = e.channel || e;
    dc2 = datachannel
    activedc = dc2
    dc2.onopen = function (e) { }
    dc2.onmessage = function (e) {
        if (e.data.size) {
            fileReceiver2.receive(e.data, {})
        } else {
            var data = JSON.parse(e.data)
            if (data.type === 'file') {
                fileReceiver2.receive(e.data, {})
            } else {
                chatlog.innerHTML += '[' + new Date() + '] ' + data.message + '</p>';
                chatlog.scrollTop = chatlog.scrollHeight;
            }
        }
    }
}

pc2.onicecandidate = function (e) {
    if (e.candidate == null) {
        localAnswer.innerText = JSON.stringify(pc2.localDescription);
    }
}
