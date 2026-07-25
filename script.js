const surpriseButton = document.getElementById("surpriseButton");
const celebrateButton = document.getElementById("celebrateButton");
const surpriseSection = document.getElementById("surpriseSection");
const countdownLabel = document.getElementById("countdownLabel");

function getNextBirthday() {
  const now = new Date();
  let year = now.getFullYear();
  let birthday = new Date(year, 8, 20, 0, 0, 0); // September = 8

  if (now > new Date(year, 8, 20, 23, 59, 59)) {
    birthday = new Date(year + 1, 8, 20, 0, 0, 0);
  }

  return birthday;
}

function updateCountdown() {
  const now = new Date();
  const currentYearBirthdayStart = new Date(now.getFullYear(), 8, 20, 0, 0, 0);
  const currentYearBirthdayEnd = new Date(now.getFullYear(), 8, 20, 23, 59, 59);

  if (now >= currentYearBirthdayStart && now <= currentYearBirthdayEnd) {
    countdownLabel.textContent = "Today is your day! Happy Birthday, Ann Mary! 🎂";
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  const difference = getNextBirthday() - now;
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

surpriseButton.addEventListener("click", () => {
  surpriseSection.classList.add("visible");
  surpriseSection.setAttribute("aria-hidden", "false");
  launchConfetti();
  setTimeout(() => {
    surpriseSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 250);
});

celebrateButton.addEventListener("click", launchConfetti);

const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
let pieces = [];
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchConfetti() {
  const palette = ["#d94f7c", "#a94eb4", "#f6b64b", "#ef7f8d", "#8f78c6"];

  pieces = Array.from({ length: 150 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * 180,
    size: 5 + Math.random() * 7,
    speedY: 2 + Math.random() * 4,
    speedX: -2 + Math.random() * 4,
    rotation: Math.random() * Math.PI,
    rotationSpeed: -0.15 + Math.random() * 0.3,
    color: palette[Math.floor(Math.random() * palette.length)],
    shape: Math.random() > 0.5 ? "rect" : "circle"
  }));

  cancelAnimationFrame(animationId);
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  pieces.forEach(piece => {
    piece.x += piece.speedX;
    piece.y += piece.speedY;
    piece.rotation += piece.rotationSpeed;

    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);
    ctx.fillStyle = piece.color;

    if (piece.shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 1.5);
    }

    ctx.restore();
  });

  pieces = pieces.filter(piece => piece.y < window.innerHeight + 40);

  if (pieces.length) {
    animationId = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}
