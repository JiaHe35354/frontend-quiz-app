const radioBtns = document.querySelectorAll(".toggle__wrapper input");

const lightBtn = document.getElementById("light");
const darkBtn = document.getElementById("dark");

const setDarkMode = () => {
  document.body.classList.add("dark");
  document.body.classList.remove("light");
  darkBtn.checked = true;
};

const setLightMode = () => {
  document.body.classList.add("light");
  document.body.classList.remove("dark");
  lightBtn.checked = true;
};

export const setColorMode = () => {
  const savedMode = localStorage.getItem("colorMode");
  if (savedMode === "dark") setDarkMode();
  if (savedMode === "light") setLightMode();
};

export const checkModeChange = () => {
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark");

  darkQuery.addEventListener("change", (e) => {
    if (e.matches) {
      localStorage.setItem("colorMode", "dark");
      setDarkMode();
    } else {
      localStorage.setItem("colorMode", "light");
      setLightMode();
    }
  });
};

radioBtns.forEach((btn) => {
  btn.addEventListener("change", () => {
    if (darkBtn.checked) {
      localStorage.setItem("colorMode", "dark");
      setDarkMode();
    } else {
      localStorage.setItem("colorMode", "light");
      setLightMode();
    }
  });
});
