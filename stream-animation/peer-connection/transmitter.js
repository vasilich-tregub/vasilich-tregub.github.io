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
console.log('Got stream from canvas');

// ICE negotiations etc.

localOffer.innerText = remoteAnswer.innerText = "";

    createBtn.onclick = function () {
        dc1 = pc1.createDataChannel('test', { reliable: true })
        activedc = dc1
        dc1.onopen = function (e) { channelClose.hidden = true; channelOpen.hidden = false; }
        dc1.onclose = function (e) { channelClose.hidden = false; channelOpen.hidden = true; }
        dc1.onmessage = function (e) {
            if (e.data.size) {
                fileReceiver1.receive(e.data, {})
            } else {
                if (e.data.charCodeAt(0) == 2) {
                    return
                }
                var data = JSON.parse(e.data)
                if (data.type === 'file') {
                    fileReceiver1.receive(e.data, {})
                } else {
                    chatlog.innerHTML += '[' + new Date() + '] ' + data.message + '</p>';
                    chatlog.scrollTop = chatlog.scrollHeight
                }
            }
        }
        stream.getTracks().forEach(
            track => {
                if (!pc1.getSenders().some(sender => sender.track === track)) {
                    pc1.addTrack(
                        track,
                        stream
                    );
                    console.log(pc1.getSenders());
                }
            }
        );
        console.log('Added local stream to pc1');
        pc1.createOffer(function (desc) {
            pc1.setLocalDescription(desc, function () { }, function () { })
        }, function () { }, sdpConstraints)
        answerLabel.hidden = false;
        answerRecdBtn.disabled = false;
        copyToClipboard.disabled = false;
    };

    copyToClipboard.onclick = function () {
        navigator.clipboard.writeText(JSON.stringify(pc1.localDescription));
        idPlacedToClipboard.hidden = false;
    }

    answerRecdBtn.onclick = function () {
        var answer = remoteAnswer.innerText;
        var answerDesc = new RTCSessionDescription(JSON.parse(answer))
        pc1.setRemoteDescription(answerDesc);
    };

    var cfg = { 'iceServers': [/*{'url': "stun:stunserver2025.stunprotocol.org"}*/] },
        con = { 'optional': [{ 'DtlsSrtpKeyAgreement': true }] }

    var pc1 = new RTCPeerConnection(/*cfg, con*/);

    var sdpConstraints = {
        optional: [],
    }

    function sendMessage() {
        if (messageTextBox.value) {
            activedc.send(JSON.stringify({ message: messageTextBox.value }));
            chatlog.innerHTML += '[' + new Date() + '] ' + messageTextBox.value + '</p>';
            messageTextBox.value = "";
        }
        return false
    }

    pc1.onicecandidate = function (e) {
        if (e.candidate == null) {
            localOffer.innerText = JSON.stringify(pc1.localDescription);
        }
    }
