(function() {
  var container, stats;
  var camera, scene, renderer, light, ambientLight;
  var mesh, texture, geometry, material;
  var segments = 64;
  var clock = new THREE.Clock();
  var motionX = 0;
  var motionY = 0;

  init();

  function init() {
    initBackground();
    animate();

    var gui = new dat.GUI();
    
    // hack for https://github.com/dataarts/dat.gui/issues/48
    camera.rotation.x = 0.01;
    camera.rotation.y = 0.01;
    camera.rotation.z = 0.01;

    // camera controls
    var cameraControls = gui.addFolder('Camera');

    cameraControls.add(camera.rotation, 'x', -3, 3, 0.01);
    cameraControls.add(camera.rotation, 'y', -3, 3, 0.01);
    cameraControls.add(camera.rotation, 'z', -3, 3, 0.01);

    cameraControls.add(camera.position, 'x', -300, 300, 0.1);
    cameraControls.add(camera.position, 'y', -300, 300, 0.1);
    cameraControls.add(camera.position, 'z', -300, 300, 0.1);

    // mesh controls
    var meshControls = gui.addFolder('Mesh');

    meshControls.add(mesh.rotation, 'x', -3, 3, 0.01);
    meshControls.add(mesh.rotation, 'y', -3, 3, 0.01);
    meshControls.add(mesh.rotation, 'z', -3, 3, 0.01);

    meshControls.add(mesh.position, 'x', -1000, 1000);
    meshControls.add(mesh.position, 'y', -1000, 1000);
    meshControls.add(mesh.position, 'z', -1000, 1000);

    // light controls
    var lightControls = gui.addFolder('Light');

    lightControls.add(light.position, 'x', -1000, 1000);
    lightControls.add(light.position, 'y', -1000, 1000);
    lightControls.add(light.position, 'z', -1000, 1000);
    lightControls.add(light, 'power', 0, 10);
    lightControls.add(ambientLight, 'intensity', 0, 10);
  }

  function initBackground() {
    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(135, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.y = 100;

    motionY = -camera.rotation.x;

    scene = new THREE.Scene();

    geometry = new THREE.PlaneGeometry(1000, 1000, segments, segments);
    geometry.rotateX(- Math.PI / 2);

    material = new THREE.MeshPhongMaterial({color: 0x808080});

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -800;
    mesh.rotation.x = Math.PI/4;
    mesh.rotation.y = Math.PI/4;
    scene.add(mesh);

    ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    light = new THREE.PointLight(0xffffff, 1, 0);
    light.position.set(0, 800, -800);
    scene.add(light);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x404040);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, document.querySelector('body').scrollHeight);

    container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', onMotion, false);
    }
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMotion(event) {
    motionX = motionX * 0.99 + (event.accelerationIncludingGravity.x/2.0) * 0.01;
    motionY = motionY * 0.99 + (event.accelerationIncludingGravity.y/20.0) * 0.01;
    camera.rotation.y = motionX;
    camera.rotation.x = Math.max(-0.7, Math.min(0.3, -motionY)); // -.7 .. .3
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    var delta = clock.getDelta(),
    time = clock.getElapsedTime();

    for (var i = 0, l = geometry.vertices.length; i < l; i += 2) {
      geometry.vertices[i].y = 128 * Math.sin(i + time / 2);
    }

    mesh.geometry.verticesNeedUpdate = true;

    renderer.render(scene, camera);
  }
}());