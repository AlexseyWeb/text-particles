const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let adjustX = 3;
let adjustY = -10;
let hue = 0;

//handle mouse
const mouse = {
    x: null,
    y: null,
    radius: 50
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
    mouse.radius = 150;
    // console.log(mouse.x, mouse.y);
});


ctx.fillStyle = 'hsl(' + hue + ',100%, 50%)';
ctx.font = '16px Verdana';
ctx.fillText('Frontend', 0, 30);
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 40) + 5;
    }

    draw() {
        ctx.fillStyle = 'hsl(' + hue + ',100%, 50%)';

        // ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirextionX = dx / distance;
        let forceDirextionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirextionX * force * this.density;
        let directionY = forceDirextionY * force * this.density;
        if(distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;

        } else {
            if(this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if(this.x !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }
}



function init() {
    particleArray = [];
    for(let y = 0, y2 = textCoordinates.height; y < y2; y++) {
        for(let x = 0, x2 = textCoordinates.width; x < x2; x++) {
            if(textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(positionX * 25, positionY * 25));
            }
        }
    }
}

init();


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}

animate();

function connect() {
    let opacityValue = 1;
    for(let a = 0; a < particleArray.length; a++) {
        for(let b = a; b < particleArray.length; b++) {
            // let dx = mouse.x - this.x;
            // let dy = mouse.y - this.y;
            // let distance = Math.sqrt(dx * dx + dy * dy);
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            // opacityValue = 1 - (distance / 50);

            ctx.strokeStyle = 'hsl(' + a + ', 100%, 50%)';

            if(distance < 50) {
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }

        }
    }
}