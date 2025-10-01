const animate = {
  schema: {},
  init() {
    const model = this.el;

    const obj = this.el.getObject3D("mesh");
    if (!obj) return;
    obj.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        if (node.material) {
          node.material.metalness = 0.8;
          node.material.roughness = 0.34;
          node.material.color.multiplyScalar(0.7); // ярче
        }
      }
    });
  },
};
export { animate };
