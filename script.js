let scene = new THREE.Scene();

/* Kamera */
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

/* Renderer */
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* LIGHT */
let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

/* SKY */
scene.background = new THREE.Color(0x87ceeb);

/* YO'L */
let road = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 200),
  new THREE.MeshPhongMaterial({ color: 0x333333 })
);
road.rotation.x = -Math.PI / 2;
scene.add(road);

/* PLAYER CAR */
let car = new THREE.Mesh(
  new THREE.BoxGeometry(1, 0.5, 2),
  new THREE.MeshPhongMaterial({ color: 0x000000 })
);
car.position.set(0, 0.25, 5);
scene.add(car);

/* ENEMIES */
let enemies = [];

/* create enemy */
function createEnemy() {
  let enemy = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.5, 2),
    new THREE.MeshPhongMaterial({ color: 0xff0000 })
  );

  enemy.position.x = (Math.random() * 12) - 6;
  enemy.position.z = -40;
  enemy.position.y = 0.25;

  scene.add(enemy);
  enemies.push(enemy);
}

setInterval(createEnemy, 800);

/* GAME VARIABLES */
let speed = 0.4;
let score = 0;
let gameOver = false;

/* RECORD */
let highScore = localStorage.getItem("record") || 0;
document.getElementById("highScore").innerText = "Record: " + highScore;

/* MOVE */
function moveLeft() {
  car.position.x -= 0.6;
  if (car.position.x < -6.5) car.position.x = -6.5;
}

function moveRight() {
  car.position.x += 0.6;
  if (car.position.x > 6.5) car.position.x = 6.5;
}

/* BOOST */
function boost() {
  speed += 0.3;
  setTimeout(() => speed -= 0.3, 1000);
}

/* KEYBOARD */
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
  if (e.key === " ") boost();
});

/* CAMERA */
camera.position.set(0, 3, 10);
camera.lookAt(car.position);

/* LOOP */
function animate() {
  if (gameOver) return;

  requestAnimationFrame(animate);

  enemies.forEach((e, i) => {
    e.position.z += speed;

    /* score */
    if (e.position.z > 10) {
      scene.remove(e);
      enemies.splice(i, 1);
      score++;
      document.getElementById("score").innerText = "Score: " + score;
    }

    /* collision */
    if (
      Math.abs(e.position.x - car.position.x) < 1 &&
      Math.abs(e.position.z - car.position.z) < 1.5
    ) {
      endGame();
    }
  });

  speed += 0.001;

  renderer.render(scene, camera);
}

animate();

/* GAME OVER */
function endGame() {
  gameOver = true;
  document.getElementById("gameOver").style.display = "block";

  if (score > highScore) {
    localStorage.setItem("record", score);
  }
}

/* RESTART */
function restart() {
  location.reload();
}

/* RESIZE */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});