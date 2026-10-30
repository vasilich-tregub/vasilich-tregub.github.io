        const button = document.querySelector("button");
        const video = document.querySelector("video");
        const canvas = document.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        const fpsInfo = document.querySelector("#fps-info");
        const metadataInfo = document.querySelector("#metadata-info");

        let firstRun = true;
        let requestVideoFrameCallbackId = null;

        button.addEventListener("click", () =>
            video.paused ? video.play() : video.pause(),
        );

        video.addEventListener("play", () => {
            if (!("requestVideoFrameCallback" in HTMLVideoElement.prototype)) {
                console.error(
                    "Your browser does not support the `Video.requestVideoFrameCallback()` API.",
                );
            };
            video.requestVideoFrameCallback(updateCanvas);
        });

        video.addEventListener("ended", () => {
            video.cancelVideoFrameCallback(requestVideoFrameCallbackId);
            video.controls = true;
            firstRun = false;
        });

        let prevNow = 0;
        let prevMediaTime = 0;
        const updateCanvas = (now, metadata) => {

            canvas.width = metadata.width;
            canvas.height = metadata.height;

            ctx.drawImage(video, 0, 0, metadata.width, metadata.height);

            if (firstRun && (metadata.presentedFrames > 2)) {
                //const fps = ((metadata.presentedFrames - 1) / metadata.mediaTime).toFixed(3);
                fpsInfo.innerText += "{ " + ((now - prevNow)/1000).toFixed(5) + ", " + (metadata.presentedFrames - 1) + ", " + (metadata.mediaTime - prevMediaTime).toFixed(5) + "}";
            }
            prevNow = now;
            prevMediaTime = metadata.mediaTime;
            metadataInfo.innerText = JSON.stringify(metadata, null, 2);

            if (video.paused || video.ended) {
                return;
            }

            requestVideoFrameCallbackId = video.requestVideoFrameCallback(updateCanvas);
        };

        video.src = "https://mdn.github.io/shared-assets/videos/flower.mp4";

        requestVideoFrameCallbackId = video.requestVideoFrameCallback(updateCanvas);

        function reconnect(ref){
            video.src = ref;
            video.controls = false;
            firstRun = true;
            fpsInfo.innerText = "";
        }
