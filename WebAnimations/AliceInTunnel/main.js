/*
* Courtesy of Mozilla Developer Network https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API
*/
const aliceTumbling = [
    { transform: "rotate(0) translate3d(-50%, -50%, 0)", color: "black" },
    { color: "#431236", offset: 0.3 },
    { transform: "rotate(360deg) translate3d(-50%, -50%, 0)", color: "black" },
];
const aliceTiming = {
    duration: 3000,
    iterations: Infinity,
};
const aliceTumble = document.getElementById("alice").animate(aliceTumbling, aliceTiming);
const aliceTunnel = document
    .getElementById("tunnel")
    .animate(
        [
            { transform: "translate3d(0, 0, 0)" },
            { transform: "translate3d(0, -300px, 0)" },
        ],
        {
            duration: 1000,
            iterations: Infinity,
        },
    );
document.getElementById("pauseAnimation").addEventListener("click",
    function () { aliceTumble.pause(); aliceTunnel.pause(); });
document.getElementById("advanceAnimation").addEventListener("click",
    function () { step = Number(advstep.value); aliceTumble.currentTime += step; aliceTunnel.currentTime += step; });
