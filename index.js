const paper = document.querySelector("#paper"),
      pen = paper.getContext("2d");

let startTime = new Date().getTime();


paper.width = paper.clientWidth;
paper.height = paper.clientHeight;


const duration = 900;
const maxLoops = 50;
const maxAngle = 2 * Math.PI;

const oneFullLoop = 2 * Math.PI;
const start = {
    x: paper.width * 0.1,
    y: paper.height * 0.9
}

const end = {
    x: paper.width * 0.9,
    y: paper.height * 0.9
}

const length = end.x - start.x;

const center = {
    x: paper.width * 0.5,
    y: paper.height * 0.9
}

const initialArcRadius = length * 0.05;

const arcs = Array(32).fill("#3e776d").map((color, index) => {
    const audio = new Audio(`/audio/key-${index}.wav`);
    audio.volume = 0.02;
    
    
    const numberOfLoops = oneFullLoop * (maxLoops - index),
    velocity = numberOfLoops / duration;
    
    const calculateNextImpactTime = (currentImpactTime, velocity) => {
        return currentImpactTime + (Math.PI / velocity) * 1000;
    }
    
    return {
        color,
        audio,
        nextImpactTime: calculateNextImpactTime(startTime, velocity),
        velocity,
    }
});

const spacing = (length / 2 - initialArcRadius) / arcs.length;

const draw = () => {

    
    
    const currentTime = new Date().getTime(),
    elapsedTime = (currentTime - startTime) / 1000;
    
    pen.clearRect(0,0,paper.width, paper.height);
    
    pen.strokeStyle = "#3e776d";
    pen.lineWidth = 1;
    
    pen.beginPath();
    pen.moveTo(start.x, start.y);
    pen.lineTo(end.x, end.y);
    pen.stroke();
    
    // Draw the arcs and locator dots.
    arcs.forEach((arc, index) => {
        const distance = Math.PI + (elapsedTime * arc.velocity),
        modDistance = distance % maxAngle,
        adjustedDistance = modDistance >= Math.PI ? modDistance : maxAngle - modDistance;
        
        const arcRadius = initialArcRadius + (index * spacing);
        const x = center.x + arcRadius * Math.cos(adjustedDistance);
        const y = center.y + arcRadius * Math.sin(adjustedDistance);
        
        
        // Draw arc
        pen.strokeStyle = arc.color;
        pen.beginPath();
        pen.arc(center.x, center.y, arcRadius, Math.PI, maxAngle);
        pen.stroke();
        
        // Draw circle
        pen.fillStyle = arc.color;
        pen.beginPath();
        pen.arc(x, y, length * 0.0055, 0, maxAngle);
        pen.fill();
        
        
        
    });

    requestAnimationFrame(draw);
}

draw();