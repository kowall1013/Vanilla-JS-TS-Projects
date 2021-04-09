const debug = document.querySelector(".debug");
const pacmans = [...document.querySelectorAll(".pacman")];

document.addEventListener("pointermove", (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  pacmans.forEach((pacman) => {
    const pacmanBox = pacman.getBoundingClientRect();
    const pacmanXcenter = (pacmanBox.left + pacmanBox.right) / 2;
    const pacmanYcenter = (pacmanBox.top + pacmanBox.bottom) / 2;

    const deltaX = mouseX - pacmanXcenter;
    const deltaY = mouseY - pacmanYcenter;

    const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    let transform = `rotate(${angle}deg)`;

    if (Math.abs(angle) > 90) transform += "scaleY(-1)";
    pacman.style.transform = transform;
  });
});
