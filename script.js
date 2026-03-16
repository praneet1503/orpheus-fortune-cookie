gsap.set("#cookie",{scale: 0,opacity: 0,xPercent: -50,yPercent: -50});
gsap.set("#fortune-text",{scale: 0,opacity: 0, xPercent: -50,yPercent: -50});
gsap.set("#orpheus",{left: "50%", xPercent: -50, yPercent: -40, scale: 3, transformOrigin: "bottom center"});

gsap.to("#orpheus",{
  backgroundPosition: "-192px 0px",
    ease: "steps(3)",
    repeat: -1,
    duration: 0.6
})
gsap.to("#orpheus",{
    y: "-=15",
    duration: 1.5,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
});

function createParticle() {
    const stage = document.getElementById("stage");
    const orpheus = document.getElementById("orpheus");
    const rect = orpheus.getBoundingClientRect();
    const p = document.createElement("div");
    p.className = "particle";
    stage.appendChild(p);
    const startX = rect.left + (rect.width * 0.2);
    const startY = rect.top + (rect.height * 0.8);
    gsap.set(p, { x: startX, y: startY });
    gsap.to(p, {
        x: startX - (Math.random() * 100 + 50),
        y: startY + (Math.random() * 40 - 20),
        opacity: 0,
        scale: 0.5,
        duration: Math.random() * 1 + 0.5,
        ease: "power1.out",
        onComplete: () => p.remove()
    });
}
let particleInterval = setInterval(createParticle, 50);
let masterTl;

function createMasterTimeline() {
  if (masterTl) masterTl.kill();
  masterTl = gsap.timeline();
  masterTl.fromTo("#orpheus",
      {left: "110vw",rotation: 0},
      {
          left: "50%",
          xPercent: -50,
          rotation: 12,
          duration: 2.5,
          ease: "power2.inOut"
      }
  )
  .to("#orpheus",{
      rotation: -5,
      duration: 0.5,
      ease: "power1.out"
  })
  .to("#orpheus", {
    rotation: 0, 
    duration: 0.4,
    ease: "back.out(2)"
  })
  .to("#cookie", { 
    scale: 1, 
    opacity: 1, 
    duration: 0.8, 
    ease: "back.out(1.7)" 
  }, "+=0.2")
  .to("#orpheus", {
    left: "-150px", 
    rotation: -15,
    duration: 1.5,
    ease: "power2.in"
  }, "+=1")
  .to("#cookie", {
    y: "-=8",
    rotation: 4,
    duration: 1.2,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });
}

const playBtn = document.getElementById("play-btn");

playBtn.addEventListener("click", () => {
  playBtn.style.pointerEvents = "none";
  gsap.to(playBtn, { opacity: 0, duration: 0.2 });
  gsap.to("#orpheus", {
    left: "-150px",
    duration: 1.5,
    ease: "power2.in",
    onComplete: () => {
      createMasterTimeline();
    }
  });
});

const cookieEl = document.getElementById("cookie");
const fortuneTextEl = document.getElementById("fortune-text");
const fortunesReady = loadFortunes();
let fortunes = [];

async function loadFortunes() {
  try {
    const response = await fetch("fortunes.csv");
    if (!response.ok) {
      throw new Error(`Failed to load fortunes.csv (${response.status})`);
    }

    const csvText = await response.text();
    fortunes = csvText
      .trim()
      .split("\n")
      .slice(1)
      .map((line) => line.split(/,(.+)/)[1]?.trim())
      .filter(Boolean);
  } catch (error) {
    console.error("Could not load fortunes:", error);
    fortunes = [];
  }
}

function randomFortune() {
  if (!fortunes.length) return "Trust your timing.";
  const i = Math.floor(Math.random() * fortunes.length);
  return fortunes[i];
}

let currentCustomMessage = "";

document.getElementById("set-msg-btn").addEventListener("click", () => {
  const input = document.getElementById("custom-fortune");
  currentCustomMessage = input.value.trim();
  
  const btn = document.getElementById("set-msg-btn");
  const originalText = btn.textContent;
  btn.textContent = "Saved!";
  setTimeout(() => {
    btn.textContent = originalText;
  }, 1000);
});

cookieEl.addEventListener("click", async () => {
  await fortunesReady;
  fortuneTextEl.textContent = currentCustomMessage ? currentCustomMessage : randomFortune();
  gsap.killTweensOf("#cookie");
  const clickTl = gsap.timeline();
  clickTl
    .to("#cookie", {
      x: "+=random(-6, 6)",
      y: "+=random(-6, 6)",
      rotation: "random(-10, 10)",
      duration: 0.05,
      repeat: 12,
      yoyo: true
    })
    .set("#cookie", { backgroundPosition: "-96px 0px", x: "-50%", y: "-50%", rotation: 0 })
    .to("#cookie", { scale: 1.3, duration: 0.15, ease: "power2.out" })
    .set("#cookie", { backgroundPosition: "-192px 0px" })
    .to("#cookie", { scale: 1.1, duration: 0.1 })
    .to("#fortune-text", {
      scale: 1,
      opacity: 1,
      top: "30%",
      duration: 1,
      ease: "expo.out"
    }, "-=0.1")
    .to("#restart-btn", { 
      opacity: 1, 
      duration: 0.5, 
      onComplete: () => document.getElementById("restart-btn").style.pointerEvents = "auto" 
    }, "+=0.5");

  cookieEl.style.pointerEvents = "none";
});

document.getElementById("restart-btn").addEventListener("click", () => {
  const btn = document.getElementById("restart-btn");
  btn.style.pointerEvents = "none";
  gsap.to(btn, { opacity: 0, duration: 0.2 });
  gsap.set("#cookie", { backgroundPosition: "0px 0px", scale: 0, opacity: 0, x: 0, y: 0, rotation: 0, xPercent: -50, yPercent: -50 });
  gsap.set("#fortune-text", { scale: 0, opacity: 0, top: "50%", xPercent: -50, yPercent: -50 });
  cookieEl.style.pointerEvents = "auto";
  createMasterTimeline();
});

let mediaRecorder;
let recordedChunks = [];
const recordBtn = document.getElementById("record-btn");

recordBtn.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: "browser" },
      audio: true, 
    });

    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorder.ondataavailable = function (e) {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    mediaRecorder.onstop = function () {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style.display = "none";
      a.href = url;
      a.download = "fortune-cookie-animation.webm";
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      recordedChunks = [];
      recordBtn.textContent = "Record Video";
      recordBtn.style.pointerEvents = "auto";
    };

    mediaRecorder.start();
    recordBtn.textContent = "Recording...";
    recordBtn.style.pointerEvents = "none";

    const btn = document.getElementById("restart-btn");
    const pBtn = document.getElementById("play-btn");
    gsap.set(btn, { opacity: 0 });
    gsap.set(pBtn, { opacity: 0, pointerEvents: "none" });
    gsap.set("#cookie", { backgroundPosition: "0px 0px", scale: 0, opacity: 0, x: 0, y: 0, rotation: 0, xPercent: -50, yPercent: -50 });
    gsap.set("#fortune-text", { scale: 0, opacity: 0, top: "50%", xPercent: -50, yPercent: -50 });
    
    gsap.to("#orpheus", {
      left: "-150px",
      duration: 1.5,
      ease: "power2.in",
      onComplete: () => {
        createMasterTimeline();
      }
    });

    stream.getVideoTracks()[0].onended = function () {
      mediaRecorder.stop();
    };

  } catch (error) {
    console.error("Error starting recording:", error);
    recordBtn.textContent = "Record Video";
    recordBtn.style.pointerEvents = "auto";
  }
});

