const panoList = [
  "textures/panorama1.jpg",
  "textures/panorama2.jpg",
  "textures/panorama3.jpg",
  "textures/panorama4.jpg",
];

const volkTemplate = `
    <a-entity class="target-volk-content">
      <a-entity class="models" animation-mixer="clip: idle_guitar; loop: repeat" gltf-model="#guitarModel"
        rotation="0 0 0" position="-0.25 -.5 0" scale=".7 .7 .7"></a-entity>

      <!-- Робот -->
      <a-entity animation-mixer="clip: idle_robot; loop: repeat" gltf-model="#robotModel" class="models"
        rotation="0 -60 0" position="0.75 -0.5 0" scale="0.75 0.75 0.75" shadow="cast: true; receive: true">
        <a-light type="point" color="white" position="0 3 0" intensity="0.5"></a-light>
        <a-plane src="#bblTexture" rotation="0 60 0" position="0 1.6 0" scale="1 0.6 0.01"
          transparent="true"></a-plane>
      </a-entity>

      <a-entity light="type: ambient; intensity: 1.2; color: #ffffff"></a-entity>
      <a-entity light="type: directional; intensity: 1.5; castShadow: true" position="1 4 3"
        shadow-map-width="2048" shadow-map-height="2048"></a-entity>

      <a-plane rotation="-90 0 0" position="0 -2 0" width="100" height="100"
        color="#ffffff" material="shader: shadow" shadow></a-plane>
    </a-entity>`;

const trioTemplate = `
    <a-entity class="target-trio-content">

     <!-- Ящик -->
      <a-entity class="models" animation-mixer="clip: box_idle_01; loop: repeat" gltf-model="#boxModel"
        rotation="0 0 0" position="0 -.5 0" scale="0.6 0.6 0.6"></a-entity>

        <!-- Рогатка -->
      <a-entity class="models" gltf-model="#rogatkaModel" rotation="-115 30 0" position="0.32 -0.5 0"
        scale="2.5 2.5 2.5"></a-entity>

         <!-- Тыква -->
      <a-entity class="models" gltf-model="#heliModel" animation-mixer="clip: arm_helicopter_fly; loop: repeat" rotation="0 -45 0" position="-0.5 .5 0"
        scale="0.6 0.6 0.6"></a-entity>
        
            <a-entity class="models" gltf-model="#icecreamModel" rotation="0 45 0" position="-0.5 -0.5 0"
        scale="0.4 0.4 0.4"></a-entity>

      <a-entity light="type: ambient; intensity: 1.2; color: #ffffff"></a-entity>
      <a-entity light="type: directional; intensity: 1.5; castShadow: true" position="1 4 3"
        shadow-map-width="1024" shadow-map-height="1024"></a-entity>

      <a-plane rotation="-90 0 0" position="0 -2 0" width="100" height="100"
        color="#ffffff" material="shader: shadow" shadow></a-plane>
    </a-entity>`;

export default { panoList, volkTemplate, trioTemplate };
