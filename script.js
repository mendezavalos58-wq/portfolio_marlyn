const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");
const progressBar = document.getElementById("progressBar");
const avatarFollower = document.getElementById("avatarFollower");
const avatarSpeech = document.getElementById("avatarSpeech");

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
navigation.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const sectionMessages = {
  home: "Hello! I’m your companion for the journey. Let’s explore.",
  about: "This is where I talk about myself.",
  skills: "My skills! Each one represents something you have learned..",
  projects: "This section shows my ideas turned into projects.",
  certificates: "Keep learning! Here are my courses.",
  contact: "Have we reached the end? Now you can connect with other people!"
};
const sections = [...document.querySelectorAll("main section[id]")];
let activeSection = "home";
let ticking = false;
let speechTimer;

function setAvatarMessage(message, speak = false) {
  avatarSpeech.textContent = message;
  if (speak) {
    avatarFollower.classList.add("speaking");
    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => avatarFollower.classList.remove("speaking"), 3300);
  }
}

function updateOnScroll() {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.width = `${progress * 100}%`;

  // Keep the character beside the content as the visitor moves down the page.
  const mobile = window.matchMedia("(max-width: 680px)").matches;
  if (!mobile) {
    const topStart = window.innerHeight * 0.19;
    const travel = Math.max(0, window.innerHeight - avatarFollower.offsetHeight - topStart - 18);
    avatarFollower.style.top = `${topStart + progress * travel}px`;
    avatarFollower.style.bottom = "auto";
  } else {
    avatarFollower.style.top = "auto";
    avatarFollower.style.bottom = "14px";
  }
  avatarFollower.classList.toggle("visible", window.scrollY > window.innerHeight * 0.22);
  avatarFollower.classList.toggle("bob", window.scrollY > window.innerHeight * 0.22);

  const marker = window.innerHeight * 0.42;
  let current = sections[0]?.id || "home";
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= marker) current = section.id;
  }
  if (current !== activeSection) {
    activeSection = current;
    setAvatarMessage(sectionMessages[current] || "Let’s continue exploring your portfolio!", true);
  }
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateOnScroll);
    ticking = true;
  }
}, { passive: true });
window.addEventListener("resize", updateOnScroll);
updateOnScroll();

// A click makes the companion greet the visitor; pointer movement adds a subtle 3D tilt.
avatarFollower.addEventListener("click", () => {
  const messages = [
    "It’s great to have you here!",
    "Keep scrolling—there’s still more to discover.",
    "Thanks for visiting my portfolio!",
    "Every project is a new opportunity to learn."
  ];
  const next = messages[Math.floor(Math.random() * messages.length)];
  setAvatarMessage(next, true);
  avatarFollower.classList.remove("wave");
  void avatarFollower.offsetWidth;
  avatarFollower.classList.add("wave");
  avatarFollower.setAttribute("aria-expanded", "true");
});
avatarFollower.addEventListener("animationend", event => {
  if (event.animationName === "avatarWave") avatarFollower.classList.remove("wave");
});

const heroFrame = document.querySelector(".avatar-frame");
const heroVisual = document.querySelector(".hero-visual");
if (heroFrame && heroVisual && window.matchMedia("(pointer:fine)").matches) {
  heroVisual.addEventListener("pointermove", event => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    heroFrame.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 7}deg) translateZ(8px)`;
  });
  heroVisual.addEventListener("pointerleave", () => {
    heroFrame.style.transform = "";
  });
}

const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("senderName").value.trim();
  const email = document.getElementById("senderEmail").value.trim();
  const message = document.getElementById("senderMessage").value.trim();
  const recipient = "mendezavalos58@gmail.com";
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});
