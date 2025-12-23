let processor = {
    timerCallback: function() {
      if (this.video.paused || this.video.ended) {
        return;
      }
      this.computeFrame();
      let self = this;
      setTimeout(function () {
          self.timerCallback();
        }, 0);
    },
  
    doLoad: function() {
      this.video = document.getElementById("idVideo");
      this.canvas = document.getElementById("glCanvas");
      this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
      let self = this;
      this.video.addEventListener("play", function() {
          self.width = self.video.videoWidth;
          self.height = self.video.videoHeight;
          self.timerCallback();
        }, false);
    },
  
    computeFrame: function() {
      this.ctx.drawImage(this.video, 0, 0, this.width, this.height);
      let frame = this.ctx.getImageData(0, 0, this.width, this.height);
      // process frame pixels
        this.ctx.font = "48px serif";
        this.ctx.fillStyle = "orange";
        if (this.video.currentTime > 0.5 && this.video.currentTime < 6) {
            this.ctx.fillText("From: LUCASFILM (C), 2016, Theatrical Trailer", 300, 775);
        }
        else if (this.video.currentTime > 7 && this.video.currentTime < 9) {
            this.ctx.fillText("The world is coming undone", 500, 775);
        }
        else if (this.video.currentTime >= 10 && this.video.currentTime < 13) {
            this.ctx.fillText("Imperial flags reign across the galaxy", 500, 775);
        }
        else if (this.video.currentTime >= 18 && this.video.currentTime < 20) {
            this.ctx.fillText("Can you be trusted without your shackles?", 500, 775);
        }
        else if (this.video.currentTime >= 20.5 && this.video.currentTime < 22.5) {
            this.ctx.fillText("Let's just get this over with, shall we?", 500, 775);
        }
        else if (this.video.currentTime >= 23 && this.video.currentTime < 24.3) {
            this.ctx.fillText("We have a mission for you.", 500, 775);
        }
        // or put processed pixels
      //this.ctx.putImageData(frame, 0, 0);
      return;
    }
  };

document.addEventListener("DOMContentLoaded", () => {
  processor.doLoad();
});
