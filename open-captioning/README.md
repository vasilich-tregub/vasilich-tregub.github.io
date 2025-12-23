# Open captioned video clip recording

In the timer callback procedure a frame from the video control is drawn to the canvas and a subtitle is also drawn. 
The subtitle text is taken from a lookup table mapping the current time to the text to be embedded into the frame.

Recording of the open-captioned video starts with the 'playing' event and ends with the 'ended' event of the player. 
The browser asks user to download the recorded video using the trick when the achor link which is created and clicked 
in  'canvas-recording.js'. The media recorder starts with the player event 'playing'. Pay attention, the media 
recorder event listener 'stop' is defined in the procedure 'startRecording()'. The event calls the procedure 
downloadRecording() which performs all manipulations with the download anchor.

TODO:  
1) Add audio to recorded clip  
2) Schedule timer callback in accordance with the frame rate  
3) Use two web workers, one for drawing frames in canvas and another for recording frames  

