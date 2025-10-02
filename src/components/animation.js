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
          node.material.metalness = 0.2;
          node.material.roughness = 1;
        //   node.material.color.multiplyScalar(1); // ярче
        }
      }
    });
  },
};
export { animate };
