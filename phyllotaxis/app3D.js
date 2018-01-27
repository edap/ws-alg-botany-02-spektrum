const scene = new THREE.Scene();
let exporting = false;
let gui;
let objects = [];
let group = new THREE.Group();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});
const materials = new CollectionMaterials;
const geometries = new CollectionGeometries;

function init() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.style.margin =0;
  document.body.appendChild(renderer.domElement);
  camera.position.z = 80;
  controls = new THREE.OrbitControls( camera, renderer.domElement );

  //lights
  let ambientLight = new THREE.AmbientLight( 0x000000 );
  scene.add( ambientLight );
  gui = new Gui(exportMesh, regenerateMesh);
  gui.addScene(scene, ambientLight, renderer);
  gui.addMaterials(materials);

  let lights = [];
  lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
  lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
  lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

  lights[ 0 ].position.set( 0, 200, 0 );
  lights[ 1 ].position.set( 100, 200, 100 );
  lights[ 2 ].position.set( - 100, - 200, - 100 );

  scene.add( lights[ 0 ] );
  scene.add( lights[ 1 ] );
  scene.add( lights[ 2 ] );

  let axisHelper = new THREE.AxesHelper( 50 );
  scene.add( axisHelper );

  window.addEventListener('resize', function() {
      let WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
  });

  populateGroup(geometries[gui.params.geometry],materials[gui.params.material]);
  render();
};

function populateGroup(selected_geometry, selected_material) {
  for (let i = 0; i< gui.params.num; i++) {
      // WS 02, make a meaningfull composition, experiment with other geometries like
      // https://threejs.org/docs/#api/geometries/IcosahedronGeometry
      // let coord = phyllotaxisConical(i, gui.params.angle, gui.params.spread, gui.params.extrude);
      // let coord =  phyllotaxisWrong(i, gui.params.angle, gui.params.spread, gui.params.num);
      let coord =  phyllotaxisSimple(i, gui.params.angle, gui.params.spread, gui.params.extrude);
      let object = new THREE.Mesh(selected_geometry, selected_material);
      object.position.set(coord.x, coord.y, coord.z);
      object.rotateY( (90 + 40 + i * 100/gui.params.num ) * -Math.PI/180.0 );

      objects.push(object);
      group.add(object);
  }
  scene.add(group);
}

function addStats(debug) {
  if (debug) {
      //document.body.appendChild(stats.domElement);
  }
}


function resetGroup(){
  for (let index in objects) {
      let object = objects[index];
      group.remove( object );
  }
  scene.remove(group);
  objects = [];
}

function render(){
  if(!exporting){
      // TODO , try to rotate the group
      //group.rotateZ( 0.0137);
      renderer.render(scene, camera);
  }
  requestAnimationFrame(render);
}

let exportMesh = () => {
  exporting = true;
  let selected_geometry = mergeObjectsInOneGeometry(objects);
  let mesh = new THREE.Mesh(selected_geometry, materials[gui.params.material]);
  scene.add(mesh);
  exportMeshAsObj(scene);
  scene.remove(mesh);
  exporting = false;
}

let regenerateMesh = () => {
  resetGroup();
  populateGroup(geometries[gui.params.geometry],materials[gui.params.material]);
}

function mergeObjectsInOneGeometry(objects){
  let geometry = new THREE.Geometry();
  for (let i = 0; i < objects.length; i++){
      let mesh = objects[i];
      mesh.updateMatrix();
      geometry.merge(mesh.geometry, mesh.matrix);
  }
  return geometry;
}


init();


/* Phyllotaxis algorithm */
function phyllotaxisSimple(i, angleInRadians, spread, extrude){
  let current_angle = i * angleInRadians;
  let radius = spread * Math.sqrt(i);
  let x = radius * Math.cos(current_angle);
  let y = radius * Math.sin(current_angle);
  let z = 0.0;
  if (extrude) {
      z = i * -.05;
  }
  return {x, y, z};
}

function phyllotaxisConical(i, angleInRadians, spread, extrude){
  let current_angle = i * angleInRadians;
  let radius = spread * Math.sqrt(i);
  let x = radius * Math.cos(current_angle);
  let y = radius * Math.sin(current_angle);
  let z = i * - extrude;
  return {x, y, z};
}

function phyllotaxisApple(i, angle, spread, tot){
  let inc = Math.PI / tot;
  let current_angle = i * inc;
  let current_angle_b= i * angle;
  let radius = spread * Math.sqrt(i);
  let x = radius * Math.sin(current_angle) * Math.cos(current_angle_b);
  let y = radius * Math.sin(current_angle) * Math.sin(current_angle_b);
  let z = radius * Math.cos(current_angle);
  return {x, y, z};
}

// this function is called Wrong because it is wrong! it was born as mistake
// while i was passing angles in degreees without converting them to radians.
// But sometimes there are strange patterns that generate a nice effect,
// and I've decided to keep it
// To use it, pass the angles in degrees
function phyllotaxisWrong(i, angle, spread, tot){
  //let inc = Math.PI / tot;
  let inc = 180.0 / tot;
  let current_angle = i * inc;
  let current_angle_b= i * angle;
  let radius = spread * Math.sqrt(i);
  let x = radius * Math.sin(current_angle) * Math.cos(current_angle_b);
  let y = radius * Math.sin(current_angle) * Math.sin(current_angle_b);
  let z = radius * Math.cos(current_angle);
  return {x, y, z};
}