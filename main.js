// Use const for elements that are not going to change
const output = document.getElementById("out");
const ball = document.getElementById("ball");
const scoreDisplay = document.getElementById("score");
const controller = document.getElementById("controller-dot");
const numberOfPoints = 213;

let ballSize = ball.clientHeight;
let x = 0;
let y = 0;
let points = 0;
let sprintPercent = 1
let massSlowPercent = ballSize - ballSize / 2
let playerColor = "#FF0000"

scoreDisplay.innerText = points;
changeSize(ballSize);

function renderPoints() {
    for (let i = 0; i < numberOfPoints; i++) {
        const div = document.createElement("div");
        let size = Math.floor(Math.random() * 6 + 5)
        div.classList.add("point");
        div.id = `point-${i}`;
        div.style.top = Math.random() * window.innerHeight + "px";
        div.style.left = Math.random() * window.innerWidth + "px";
        div.style.width = size + "px"
        div.style.height = size + "px"
        div.style.backgroundColor = getRandColor()
        document.body.appendChild(div);
    }
}

renderPoints();

window.addEventListener("gamepadconnected", (event) => {
    const update = () => {
        const gamepads = navigator.getGamepads();
        for (const gamepad of gamepads) {
            if (!gamepad) continue;
            gamepad.axes.forEach((axis, index) => move(axis, index));
            gamepad.buttons.forEach((button, index) => {
                if (button.pressed && index == 0) jump(index);
                if(button.pressed && index == 7) sprint(button.value)
            });
        }
        requestAnimationFrame(update);
    };
    update();
});

window.addEventListener("keydown", (event) => {
    console.log(event)

    if(event.keyCode === 68){
        move(1, 0)
    }
    if(event.keyCode === 65){
        move(-1, 0)
    }
    if(event.keyCode === 87){
        move(-1,1)
    }
    if(event.keyCode === 83){
        move(1,1)
    }
});

function move(value, axis) {
    if (axis === 1 && value !== 0) {
        y += (value * 3) * sprintPercent;
        const controllerX = value * 50 + 50;
        controller.style.top = `${controllerX}%`;
        ball.style.top = `${y}px`;
        detect();
    }
    if (axis === 0 && value !== 0) {
        x += (value * 3) * sprintPercent;
        const controllerY = value * 50 + 50;
        controller.style.left = `${controllerY}%`;
        ball.style.left = `${x}px`;
        detect();
    }
}

function jump(index) {
    let isJumping = false;
    if (!isJumping) {
        isJumping = true;
        ball.style.transform = "scale(200%)";
        setTimeout(() => {
            ball.style.transform = "scale(100%)";
        }, 1000);
    }
}

function getRandColor() {
    var r = Math.floor(Math.random() * 256); 
    var g = Math.floor(Math.random() * 256); 
    var b = Math.floor(Math.random() * 256);
    var luminosidade = r + g + b; 
    if (luminosidade < 382) { 
      var corHex = "#" + r.toString(16) + g.toString(16) + b.toString(16);
      return corHex;
    } else {
      return getRandColor(); 
    }
  }

function sprint(value){
    sprintPercent = value * 2 + 1
    console.log(sprintPercent);
}

function detect() {
    for (let i = 0; i < numberOfPoints; i++) {
        const currPoint = document.getElementById(`point-${i}`);
        if (!currPoint) continue;
        const pTop = Number(currPoint.style.top.replace("px", ""));
        const pLeft = Number(currPoint.style.left.replace("px", ""));
        const cx = x + ballSize / 2;
        const cy = y + ballSize / 2;
        const px = pLeft + currPoint.offsetWidth / 2;
        const py = pTop + currPoint.offsetHeight / 2;
        const dx = px - cx;
        const dy = py - cy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= (ballSize + Math.max(currPoint.offsetWidth, currPoint.offsetHeight)) / 2) {
            currPoint.remove();
            points++;
            ball.style.backgroundColor = currPoint.style.backgroundColor
            console.log({a:ball.style.backgroundColor, b:currPoint.style.backgroundColor})
            scoreDisplay.innerText = points;
            changeSize(ballSize + 1);
            if (points >= numberOfPoints) {
                renderPoints();
                changeSize(25);
                points = 0;
                scoreDisplay.innerText = points;
            }
        }
    }
}


function changeSize(size) {
    ballSize = size;
    ball.style.height = `${size}px`;
    ball.style.width = `${size}px`;
}
