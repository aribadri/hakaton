const changeTextures = {
  init() {
    console.log("    AFRAME.registerComponent('change-textures', changeTextures)");
    
    const model = document.getElementById("model");
    const music = document.getElementById("music");
    const btn = document.querySelector(".start-btn");

    model.addEventListener("model-loaded", () => {
      const btns = document.querySelectorAll(".btns-wrapper__item");
      const mesh = model.getObject3D("mesh");
      btn.addEventListener("click", () => {
        console.log("click");
        music.components.sound.playSound();
        model.setAttribute("animation-mixer", {
          clip: "mixamo.com",
          loop: "once",
        });
      });
      if (mesh) {
        mesh.traverse((node) => {
          if (node.isMesh) {
            for (let i = 0; i < btns.length; i++) {
              btns[i].addEventListener("click", () => {
                const newColor = new THREE.Color(
                  getComputedStyle(btns[i]).backgroundColor
                );
                if (node.material && node.name === "Object_7") {
                  node.material.color = newColor;
                }
              });
            }
          }
        });
      }
    });
  },
};

export { changeTextures };
