gsap.set("#cookie",{scale: 0,opacity: 0,xPercent: -50,yPercent: -50});
gsap.set("#fortune-text",{scale: 0,opacity: 0, xPercent: -50,yPercent: -50});
gsap.set("#orpheus",{yPercent: -40, scale: 3, transformOrigin: "bottom center"});

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
})
const masterTl = gsap.timeline();
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

const cookieEl = document.getElementById("cookie");

cookieEl.addEventListener("click", () => {
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
    }, "-=0.1"); 
    
    cookieEl.style.pointerEvents = "none";
});