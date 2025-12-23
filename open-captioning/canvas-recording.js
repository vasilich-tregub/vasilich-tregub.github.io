/* Canvas recording script */

document.addEventListener('DOMContentLoaded', () => {
    let mediaRecorder = null;
    let recordedChunks = [];
    let isRecording = false;

    const player = document.getElementById('idVideo');
    const canvas = document.getElementById('glCanvas');
    const buttonStartRecording = document.getElementById('startRecord');
    const buttonStopRecording = document.getElementById('stopRecord');
    const status = document.getElementById('status');

    const updateUi = () => {
        if (isRecording) {
            buttonStartRecording.disabled = true;
            buttonStartRecording.classList.add('recording');
            buttonStopRecording.disabled = false;
            status.textContent = 'Recording in progress...';
            status.className = 'status recording';
        } else {
            buttonStartRecording.disabled = false;
            buttonStartRecording.classList.remove('recording');
            buttonStopRecording.disabled = true;
            status.textContent = 'Ready to record';
            status.className = 'status ready';
        }
    };

    const downloadRecording = () => {
        if (recordedChunks.length === 0) {
            alert('No recording data available!');
            return;
        }

        const blob = new Blob(recordedChunks, { type: 'video/webm' });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;

        a.download = `starwars-subtitles-${Date.now()}.webm`;

        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);

        recordedChunks = [];
    };

    const startRecording = async () => {
        try {
            const stream = canvas.captureStream(30);

            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            recordedChunks = [];

            mediaRecorder.addEventListener('dataavailable', (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            });

            mediaRecorder.addEventListener('stop', () => {
                downloadRecording();
            });

            mediaRecorder.start();
            isRecording = true;

            updateUi();
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Error starting recording:', error.message);
        }
    };
    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            isRecording = false;
            updateUi();
        }
    };

    player.addEventListener('playing', (even) => {
        startRecording();
    });

    player.addEventListener('ended', (even) => {
        stopRecording();
        alert("playback ended. If browser asks, save the recorded clip, otherwise find the clip in Downloads");
    });
    //buttonStartRecording.addEventListener('click', startRecording);
    //buttonStopRecording.addEventListener('click', stopRecording);
});
