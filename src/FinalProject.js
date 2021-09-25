import * as THREE from '../lib/three.js-master/build/three.module.js';
import * as TWEEN from '../lib//tween.esm.js';
import {GLTFLoader} from '../lib/three.js-master/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from '../lib/three.js-master/examples/jsm/controls/OrbitControls.js';
import CannonDebugRenderer from '../lib/CannonDebugRenderer.js';


function main() {

const canvas = document.querySelector('#gl-canvas');
const renderer = new THREE.WebGLRenderer({canvas});
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = false;


// *** camera setup *** //

const fov = 75;
const aspect = canvas.height/canvas.width;  
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.x = -15;
camera.position.y = 2;
camera.rotation.y += -Math.PI/2;


// *** controls *** //

/*
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);
controls.update();
*/


const scene = new THREE.Scene();
scene.background = new THREE.Color('skyblue');

// *** lights setup *** //

{
    {
        const skyColor = 0xB1E1FF;
        const groundColor = 0x329832;
        const intensity = 4;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.width = 100;
        light.position.set(-3, 15, 10);
        light.target.position.set(0, 3, 0);
        if(true) {
          light.castShadow = true;

          light.shadow.camera.near = 0.5;
          light.shadow.camera.far = 40; //camera.far;
          light.shadow.camera.fov = 100;
          light.shadow.camera.width = 300;
          light.shadow.camera.height = 100;
          light.shadow.camera.left = -15;
          light.shadow.camera.bottom = -15;
          light.shadow.camera.right = 15;
          light.shadow.camera.top = 15;

          light.shadowMapBias = 0.1;
          light.shadowMapDarkness = 0.7;
          light.shadow.mapSize.width = 2*512;
          light.shadow.mapSize.height = 2*512;
        }
        scene.add(light);
        scene.add(light.target);

        /*
        const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
        scene.add(cameraHelper);
        cameraHelper.update();
        */
    
    }
}

// *** objects setup *** //

const models = {
  dragon: {url: '../models/Dragon.gltf', gltf: undefined},
  wizard: {url: '../models/Wizard6.gltf', gltf: undefined},
  birch1: {url: '../models/BirchTree_2.glb', gltf: undefined},
  birch2: {url: '../models/BirchTree_2.glb', gltf: undefined},
  birch3: {url: '../models/BirchTree_3.glb', gltf: undefined},
  birch4: {url: '../models/BirchTree_4.glb', gltf: undefined},
  bush1: {url: '../models/Bush_1.glb', gltf: undefined},
  bush2: {url: '../models/Bush_1.glb', gltf: undefined},
  bush3: {url: '../models/Bush_1.glb', gltf: undefined},
  pineTree1: {url: '../models/PineTree_1.glb', gltf: undefined},
  pineTree11: {url: '../models/PineTree_1.glb', gltf: undefined},
  pineTree12: {url: '../models/PineTree_1.glb', gltf: undefined},
  pineTree2: {url: '../models/PineTree_2.glb', gltf: undefined},
  pineTree21: {url: '../models/PineTree_2.glb', gltf: undefined},
  pineTree3: {url: '../models/PineTree_3.glb', gltf: undefined},
  pineTree31: {url: '../models/PineTree_3.glb', gltf: undefined},
  rock1: {url: '../models/Rock_Moss_1.glb', gltf: undefined},
  rock2: {url: '../models/Rock_2.glb', gltf: undefined},
  rock3: {url: '../models/Rock_6.glb', gltf: undefined},
  woodLog: {url: '../models/WoodLog.glb', gltf: undefined},
  commonTree1: {url: '../models/CommonTree_1.glb', gltf: undefined},
  commonTree2: {url: '../models/CommonTree_4.glb', gltf: undefined}
}

const manager = new THREE.LoadingManager();
manager.onLoad = init;

const gltfLoader = new GLTFLoader(manager);
for(const elem of Object.values(models)){
  gltfLoader.load(elem.url, (gltf)=>{
    elem.gltf = gltf});
}


function init() {

  // dragon init

  let root = models.dragon.gltf.scene;
  scene.add(root);

  const dragon = new GameObject('dragon', root);
  dragon.addAnimation('fly', fly);
  dragon.addInitFunction(
    function init(){
      const dragon = this.root.getObjectByName('BodyRoot');
      const eyes = this.root.getObjectByName('EyeArmature');

      const mesh1 = this.root.getObjectByName('Cylinder');
      const mesh2 = this.root.getObjectByName('Cylinder_1');
      const mesh3 = this.root.getObjectByName('Cylinder_2');
      const mesh4 = this.root.getObjectByName('Cylinder_3');

      mesh1.castShadow = true;
      mesh1.receiveShadow = true;
      mesh2.castShadow = true;
      mesh2.receiveShadow = true;
      mesh3.castShadow = true;
      mesh3.receiveShadow = true;
      mesh4.castShadow = true;
      mesh4.receiveShadow = true;
      
      dragon.attach(eyes);
      this.right = true;
      

    }
  );
  dragon.addUpdateFunction(
    function update(){
      const dragon = this.root.getObjectByName('BodyRoot');

      // move the bounding box with the keyboard
    
      if(inputManager.keys.a.down) {
        if(this.right){
          this.right = false;
          dragon.rotation.y += Math.PI;
        }
        bodyDragon.position.z -= this.velocity*globals.deltaTime;
      }
      if(inputManager.keys.d.down){
        if(!this.right){
          this.right = true;
          dragon.rotation.y += Math.PI;
        }
        bodyDragon.position.z += this.velocity*globals.deltaTime;
      }
     
      this.getAnimation('fly').update();

      // shoot balls with the keyboard
      if(inputManager.keys.shift.justPressed) {

        var x = bodyDragon.position.x;
        var y = bodyDragon.position.y;
        var z = bodyDragon.position.z;

        const ballBody = new CANNON.Body({ mass: 1 });
        const ballMesh = new THREE.Mesh(ballGeometry, materialRed);
        ballBody.addShape(ballShape);
        world.addBody(ballBody);
        scene.add(ballMesh);
        ballMesh.castShadow = true;
        ballMesh.receiveShadow = true;
        balls.push(ballBody);
        ballMeshes.push(ballMesh);
        let shootDir;
        if(this.right) {
          shootDir = new THREE.Vector3(0,0,1);
          z += bodyDragon.shapes[0].halfExtents.z + 1;
        }
        else {
          shootDir = new THREE.Vector3(0,0,-1);
          z -= bodyDragon.shapes[0].halfExtents.z + 1;
        }
        const shootVel = 25;
        ballBody.velocity.set(  shootDir.x * shootVel,
                                shootDir.y * shootVel,
                                shootDir.z * shootVel);
        ballBody.position.set(x,y,z);
        ballMesh.position.set(x,y,z);

        ballBody.addEventListener('collide', (event)=>{
          const idx = balls.findIndex((elem) => elem == event.target);
          removeBody.push(balls[idx]);
          removeMesh.push(ballMeshes[idx]);
          balls.splice(idx, 1);
          ballMeshes.splice(idx, 1);
          if(event.body == bodyWizard)
            hitWizard += 1;
        });
      }

      // update the position of the model according to the bounding box one

      dragon.position.copy(bodyDragon.position);
      dragon.position.y += -0.5;
    }
  );
  dragon.setVelocity(10);
  gameObjects.push(dragon);

  dragon.init();
  AnimFlySetup();


  // wizard init

  root = models.wizard.gltf.scene;
  scene.add(root);

  const wizard = new GameObject('wizard', root);
  wizard.addAnimation('run', run);
  wizard.addAnimation('pose', pose);
  wizard.addInitFunction(
    function init(){
      const body = this.root.getObjectByName('Body');
      const footR = this.root.getObjectByName('FootR');
      const lowerLegR = this.root.getObjectByName('LowerLegR');
      const footL = this.root.getObjectByName('FootL');
      const lowerLegL = this.root.getObjectByName('LowerLegL');

      lowerLegR.attach(footR);
      root.remove(footR);
      lowerLegL.attach(footL);
      root.remove(footL);
    
      body.rotation.y += Math.PI;
    
      const Mesh = root.getObjectByName('Wizard001');
      
      Mesh.castShadow = true;
      Mesh.receiveShadow = true;
    
    }
  );
  wizard.addUpdateFunction(
    function update(){
      const wizard = this.root.getObjectByName('Body');

      // move the bounding box with the keyboard

      if(inputManager.keys.left.down){
        if(this.right){
          this.right = false;
        }
        bodyWizard.position.z -= this.velocity*globals.deltaTime;
        this.getAnimation('run').update();
      }

      if(inputManager.keys.right.down){
        if(!this.right) {
          this.right = true;
        }
        bodyWizard.position.z += this.velocity*globals.deltaTime;
        this.getAnimation('run').update();
      }

      if(!inputManager.keys.left.down && !inputManager.keys.right.down){
        this.getAnimation('pose').update();
      }

      // shoot balls with the keyboard

      if(inputManager.keys.up.justPressed) {

        var x = bodyWizard.position.x;
        var y = bodyWizard.position.y;
        var z = bodyWizard.position.z;

        const ballBody = new CANNON.Body({ mass: 1 });
        const ballMesh = new THREE.Mesh(ballGeometry, materialBlue);
        ballBody.addShape(ballShape);
        world.addBody(ballBody);
        scene.add(ballMesh);
        ballMesh.castShadow = true;
        ballMesh.receiveShadow = true;
        balls.push(ballBody);
        ballMeshes.push(ballMesh);
        let shootDir;
        if(this.right) {
          shootDir = new THREE.Vector3(0,0,1);
          z += bodyWizard.shapes[0].halfExtents.z + 1;
        }
        else {
          shootDir = new THREE.Vector3(0,0,-1);
          z -= bodyWizard.shapes[0].halfExtents.z + 1;
        }
        const shootVel = 25;
        ballBody.velocity.set(  shootDir.x * shootVel,
                                shootDir.y * shootVel,
                                shootDir.z * shootVel);
        ballBody.position.set(x,y,z);
        ballMesh.position.set(x,y,z);

        ballBody.addEventListener('collide', (event)=>{
          const idx = balls.findIndex((elem) => elem == event.target);
          removeBody.push(balls[idx]);
          removeMesh.push(ballMeshes[idx]);
          balls.splice(idx, 1);
          ballMeshes.splice(idx, 1);
          if(event.body == bodyDragon)
            hitDragon += 1;
        });
      }

      // update the position of the model according to the bounding box one

      wizard.position.copy(bodyWizard.position);
      wizard.position.y += -0.5; // adjustment
    }
  )
  wizard.setVelocity(10);
  gameObjects.push(wizard);

  wizard.init();
  AnimRunSetup();
  AnimPoseSetup();


  // trees init 

  root = models.birch2.gltf.scene;
  scene.add(root);
  root.position.set(6, 0, -4);

  root = models.birch3.gltf.scene;
  scene.add(root);
  root.position.set(8, 0, -5.5);
  root.rotation.y += Math.PI/2;

  root = models.birch1.gltf.scene;
  scene.add(root);
  root.position.set(6, 0, -7);
  root.rotation.y += Math.PI;

  root = models.birch4.gltf.scene;
  scene.add(root);
  root.position.set(8, 0, 14);

  root = models.pineTree1.gltf.scene;
  scene.add(root);
  root.position.set(6, 0, 7);

  root = models.pineTree11.gltf.scene;
  scene.add(root);
  root.position.set(10, 0, 16);

  root = models.pineTree12.gltf.scene;
  scene.add(root);
  root.position.set(-5, 0, -10);

  root = models.pineTree2.gltf.scene;
  scene.add(root);
  root.position.set(15, 0, -6);

  root = models.pineTree21.gltf.scene;
  scene.add(root);
  root.position.set(5, 0, 14);

  root = models.pineTree3.gltf.scene;
  scene.add(root);
  root.position.set(14, 0, -15);

  root = models.pineTree31.gltf.scene;
  scene.add(root);
  root.position.set(9, 0, 0);
  root.rotation.y += Math.PI;

  root = models.commonTree1.gltf.scene;
  scene.add(root);
  root.position.set(15, 0, 4);

  root = models.commonTree2.gltf.scene;
  scene.add(root);
  root.position.set(5, 0, -15);
  


  //bush init

  root = models.bush1.gltf.scene;
  scene.add(root);
  root.position.set(5, 0, -4.5);

  root = models.bush2.gltf.scene;
  scene.add(root);
  root.position.set(5.5, 0, -9);

  root = models.bush3.gltf.scene;
  scene.add(root);
  root.position.set(4, 0, 7);

  //rock init

  root = models.rock1.gltf.scene;
  scene.add(root);
  root.position.set(9, 1, -6);

  root = models.rock2.gltf.scene;
  scene.add(root);
  root.position.set(6, 0, -13);

  root = models.rock3.gltf.scene;
  scene.add(root);
  root.position.set(5, 0, 10);

  // woodLog init

  root = models.woodLog.gltf.scene;
  scene.add(root);
  root.position.set(5, -0.1, 3);

  
  
}

const planeSize = 200;
const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshStandardMaterial({color: 0x329832});
planeMat.side = THREE.DoubleSide;
const planeMesh = new THREE.Mesh(planeGeo, planeMat);
planeMesh.receiveShadow = true;
planeMesh.rotation.x = Math.PI * -.5; // by default the plane is parallel to the XY plane , we want it to be pararell to XZ
scene.add(planeMesh);

const gameObjects = []; // array of all the game objects in the scene

class GameObject {
    constructor(name, root){
        this.name = name;
        this.root = root;
        this.mesh = undefined;
        this.animation = [];
        this.update = undefined; // update the model
        this.init = undefined;  // initial position and rotation of the model in the scene
        this.right = false;
        this.velocity = 0;
        this.box = undefined;
    }

    setVelocity(vel){this.velocity = vel}
    addAnimation(name, group){this.animation.push({name: name, animGroup: group})};
    addUpdateFunction(func){this.update = func;}
    addInitFunction(func) {this.init = func;}
    getAnimation(name){
      return this.animation.find((elem)=> elem.name == name).animGroup;
    }
    
}

// *** animations *** //

const fly = new TWEEN.Group();
const run = new TWEEN.Group();
const pose = new TWEEN.Group();

function AnimFlySetup(){

    const root = gameObjects.find((elem)=>elem.name == 'dragon').root;

    let Wing1L;
    let Wing2L;
    let Wing3L;
    let Wing4L;
    let Wing1R;
    let Wing2R;
    let Wing3R;
    let Wing4R;

    Wing1L = root.getObjectByName('Wing1L');
    Wing1R = root.getObjectByName('Wing1R');
    Wing2L = root.getObjectByName('Wing2L');
    Wing2R = root.getObjectByName('Wing2R');
    Wing3L = root.getObjectByName('Wing3L');
    Wing3R = root.getObjectByName('Wing3R');
    Wing4L = root.getObjectByName('Wing4L');
    Wing4R = root.getObjectByName('Wing4R');

  const flyingWing1 = [
      {x:0 , y:0 , z:0 , w:1 },
      {x:-0.066 , y:0.017 , z:-0.070 , w:0.979 },
      {x:-0.136 , y:0.035 , z:-0.145 , w:0.957 },
      {x:-0.207 , y:0.053 , z:-0.220 , w:0.935 },
      {x:-0.273 , y:0.070 , z:-0.290 , w:0.915 },
      {x:-0.262 , y:0.068 , z:-0.279 , w:0.918 },
      {x:-0.248 , y:0.064 , z:-0.264 , w:0.922 },
      {x:-0.207 , y:0.053 , z:-0.220 , w:0.935 },
      {x:-0.151 , y:0.039 , z:-0.161 , w:0.953 },
      {x:-0.066 , y:0.017 , z:-0.070 , w:0.979 },
      {x:-0.011 , y:0.003 , z:-0.011 , w:0.997 },
      {x:-0.003 , y:0.000 , z:-0.003 , w:0.999 },
      {x:0 , y:0 , z:0 , w:1 }
  ];
  
  const flyingWing2 = [
      {x:0 , y:0 , z:0 , w:1 },
      {x:-0.113 , y:0.003 , z:-0.086 , w:0.954 },
      {x:-0.234 , y:0.005 , z:-0.178 , w:0.904 },
      {x:-0.355 , y:0.008 , z:-0.270 , w:0.855 },
      {x:-0.468 , y:0.010 , z:-0.356 , w:0.809 },
      {x:-0.450 , y:0.010 , z:-0.342 , w:0.816 },
      {x:-0.426 , y:0.010 , z:-0.324 , w:0.826 },
      {x:-0.355 , y:0.008 , z:-0.270 , w:0.855 },
      {x:-0.260 , y:0.006 , z:-0.197 , w:0.894 },
      {x:-0.113 , y:0.003 , z:-0.086 , w:0.954 },
      {x:-0.018 , y:0.000 , z:-0.014 , w:0.992 },
      {x:-0.005 , y:0.000 , z:-0.003 , w:0.998 },
      {x:0 , y:0 , z:0 , w:1 }
  ];
  
  const flyingWing3 = [
      {x:0 , y:0 , z:0 , w:1 },
      {x:0 , y:0 , z:0 , w:1 },
      {x:0 , y:0 , z:0 , w:1 },
      {x:-0.022 , y:0.018 , z:-0.076 , w:0.986 },
      {x:-0.092 , y:0.076 , z:-0.316 , w:0.941 },
      {x:-0.088 , y:0.073 , z:-0.303 , w:0.944 },
      {x:-0.084 , y:0.069 , z:-0.288 , w:0.947 },
      {x:-0.070 , y:0.058 , z:-0.240 , w:0.955 },
      {x:-0.051 , y:0.042 , z:-0.175 , w:0.967 },
      {x:-0.022 , y:0.018 , z:-0.076 , w:0.986 },
      {x:-0.004 , y:0.003 , z:-0.012 , w:0.998 },
      {x:-0.000 , y:0.000 , z:-0.003 , w:0.999 },
      {x:0 , y:0 , z:0 , w:1 }
  ];
  
  const flyingWing4 = [
      {x:0 , y:0 , z:0 , w:1 },
      {x:-0.029 , y:-0.075 , z:0.160 , w:0.984 },
      {x:-0.029 , y:-0.075 , z:0.160 , w:0.984 },
      {x:-0.029 , y:-0.075 , z:0.160 , w:0.984 },
      {x:0.003 , y:-0.018 , z:0.028 , w:0.978 },
      {x:0.058 , y:0.080 , z:-0.194 , w:0.968 },
      {x:0.066 , y:0.095 , z:-0.229 , w:0.967 },
      {x:0.062 , y:0.088 , z:-0.212 , w:0.967 },
      {x:0.051 , y:0.067 , z:-0.166 , w:0.969 },
      {x:0.025 , y:0.020 , z:-0.059 , w:0.974 },
      {x:-0.006 , y:-0.034 , z:0.065 , w:0.980 },
      {x:-0.015 , y:-0.050 , z:0.102 , w:0.981 },
      {x:-0.022 , y:-0.063 , z:0.132 , w:0.983 }
  ];

    const Wing1LQuad = new THREE.Quaternion().copy(Wing1L.quaternion);
    const Wing1RQuad = new THREE.Quaternion().copy(Wing1R.quaternion);
    

    const updateFunc1 = (quad) => {
                                    Wing1L.quaternion.multiplyQuaternions(Wing1LQuad, new THREE.Quaternion(quad.x, quad.y, quad.z, quad.w));
                                    Wing1R.quaternion.multiplyQuaternions(Wing1RQuad, new THREE.Quaternion(-quad.x, -quad.y, -quad.z, quad.w));
                                }

    const Wing1Tween01 = new TWEEN.Tween({x:flyingWing1[0].x, y:flyingWing1[0].y, z:flyingWing1[0].z, w:flyingWing1[0].w}, fly).to({x:flyingWing1[1].x, y:flyingWing1[1].y, z:flyingWing1[1].z, w:flyingWing1[1].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing1Tween12 = new TWEEN.Tween({x:flyingWing1[1].x, y:flyingWing1[1].y, z:flyingWing1[1].z, w:flyingWing1[1].w}, fly).to({x:flyingWing1[2].x, y:flyingWing1[2].y, z:flyingWing1[2].z, w:flyingWing1[2].w}, 50).easing(TWEEN.Easing.Exponential.InOut);
    const Wing1Tween23 = new TWEEN.Tween({x:flyingWing1[2].x, y:flyingWing1[2].y, z:flyingWing1[2].z, w:flyingWing1[2].w}, fly).to({x:flyingWing1[3].x, y:flyingWing1[3].y, z:flyingWing1[3].z, w:flyingWing1[3].w}, 50).easing(TWEEN.Easing.Exponential.InOut);
    const Wing1Tween34 = new TWEEN.Tween({x:flyingWing1[3].x, y:flyingWing1[3].y, z:flyingWing1[3].z, w:flyingWing1[3].w}, fly).to({x:flyingWing1[4].x, y:flyingWing1[4].y, z:flyingWing1[4].z, w:flyingWing1[4].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing1Tween45 = new TWEEN.Tween({x:flyingWing1[4].x, y:flyingWing1[4].y, z:flyingWing1[4].z, w:flyingWing1[4].w}, fly).to({x:flyingWing1[5].x, y:flyingWing1[5].y, z:flyingWing1[5].z, w:flyingWing1[5].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing1Tween56 = new TWEEN.Tween({x:flyingWing1[5].x, y:flyingWing1[5].y, z:flyingWing1[5].z, w:flyingWing1[5].w}, fly).to({x:flyingWing1[6].x, y:flyingWing1[6].y, z:flyingWing1[6].z, w:flyingWing1[6].w}, 50).easing(TWEEN.Easing.Exponential.InOut);
    const Wing1Tween67 = new TWEEN.Tween({x:flyingWing1[6].x, y:flyingWing1[6].y, z:flyingWing1[6].z, w:flyingWing1[6].w}, fly).to({x:flyingWing1[7].x, y:flyingWing1[7].y, z:flyingWing1[7].z, w:flyingWing1[7].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing1Tween78 = new TWEEN.Tween({x:flyingWing1[7].x, y:flyingWing1[7].y, z:flyingWing1[7].z, w:flyingWing1[7].w}, fly).to({x:flyingWing1[8].x, y:flyingWing1[8].y, z:flyingWing1[8].z, w:flyingWing1[8].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing1Tween89 = new TWEEN.Tween({x:flyingWing1[8].x, y:flyingWing1[8].y, z:flyingWing1[8].z, w:flyingWing1[8].w}, fly).to({x:flyingWing1[9].x, y:flyingWing1[9].y, z:flyingWing1[9].z, w:flyingWing1[9].w}, 150).easing(TWEEN.Easing.Exponential.InOut);
    const Wing1Tween910 = new TWEEN.Tween({x:flyingWing1[9].x, y:flyingWing1[9].y, z:flyingWing1[9].z, w:flyingWing1[9].w}, fly).to({x:flyingWing1[10].x, y:flyingWing1[10].y, z:flyingWing1[10].z, w:flyingWing1[10].w}, 150).easing(TWEEN.Easing.Exponential.InOut);
    const Wing1Tween1011 = new TWEEN.Tween({x:flyingWing1[10].x, y:flyingWing1[10].y, z:flyingWing1[10].z, w:flyingWing1[10].w}, fly).to({x:flyingWing1[11].x, y:flyingWing1[11].y, z:flyingWing1[11].z, w:flyingWing1[11].w}, 50).easing(TWEEN.Easing.Exponential.InOut);
    const Wing1Tween1112 = new TWEEN.Tween({x:flyingWing1[11].x, y:flyingWing1[11].y, z:flyingWing1[11].z, w:flyingWing1[11].w}, fly).to({x:flyingWing1[12].x, y:flyingWing1[12].y, z:flyingWing1[12].z, w:flyingWing1[12].w}, 100).easing(TWEEN.Easing.Exponential.InOut);

    Wing1Tween01.chain(Wing1Tween12);
    Wing1Tween12.chain(Wing1Tween23);
    Wing1Tween23.chain(Wing1Tween34);
    Wing1Tween34.chain(Wing1Tween45);
    Wing1Tween45.chain(Wing1Tween56);
    Wing1Tween56.chain(Wing1Tween67);
    Wing1Tween67.chain(Wing1Tween78);
    Wing1Tween78.chain(Wing1Tween89);
    Wing1Tween89.chain(Wing1Tween910);
    Wing1Tween910.chain(Wing1Tween1011);
    Wing1Tween1011.chain(Wing1Tween1112);
    Wing1Tween1112.chain(Wing1Tween01);

    Wing1Tween01.onUpdate(updateFunc1);
    Wing1Tween12.onUpdate(updateFunc1);
    Wing1Tween23.onUpdate(updateFunc1);
    Wing1Tween34.onUpdate(updateFunc1);
    Wing1Tween45.onUpdate(updateFunc1);
    Wing1Tween56.onUpdate(updateFunc1);
    Wing1Tween67.onUpdate(updateFunc1);
    Wing1Tween78.onUpdate(updateFunc1);
    Wing1Tween89.onUpdate(updateFunc1);
    Wing1Tween910.onUpdate(updateFunc1);
    Wing1Tween1011.onUpdate(updateFunc1);
    Wing1Tween1112.onUpdate(updateFunc1);

    Wing1Tween01.start();


    const Wing2LQuad = new THREE.Quaternion().copy(Wing2L.quaternion);
    const Wing2RQuad = new THREE.Quaternion().copy(Wing2R.quaternion);

    const updateFunc2 = (quad) => {
                                    Wing2L.quaternion.multiplyQuaternions(Wing2LQuad, new THREE.Quaternion(quad.x, quad.y, quad.z, quad.w));
                                    Wing2R.quaternion.multiplyQuaternions(Wing2RQuad, new THREE.Quaternion(-quad.x, -quad.y, -quad.z, quad.w));
                                }

    const Wing2Tween01 = new TWEEN.Tween({x:flyingWing2[0].x, y:flyingWing2[0].y, z:flyingWing2[0].z, w:flyingWing2[0].w}, fly).to({x:flyingWing2[1].x, y:flyingWing2[1].y, z:flyingWing2[1].z, w:flyingWing2[1].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing2Tween12 = new TWEEN.Tween({x:flyingWing2[1].x, y:flyingWing2[1].y, z:flyingWing2[1].z, w:flyingWing2[1].w}, fly).to({x:flyingWing2[2].x, y:flyingWing2[2].y, z:flyingWing2[2].z, w:flyingWing2[2].w}, 50).easing(TWEEN.Easing.Exponential.InOut);
    const Wing2Tween23 = new TWEEN.Tween({x:flyingWing2[2].x, y:flyingWing2[2].y, z:flyingWing2[2].z, w:flyingWing2[2].w}, fly).to({x:flyingWing2[3].x, y:flyingWing2[3].y, z:flyingWing2[3].z, w:flyingWing2[3].w}, 50).easing(TWEEN.Easing.Exponential.InOut);
    const Wing2Tween34 = new TWEEN.Tween({x:flyingWing2[3].x, y:flyingWing2[3].y, z:flyingWing2[3].z, w:flyingWing2[3].w}, fly).to({x:flyingWing2[4].x, y:flyingWing2[4].y, z:flyingWing2[4].z, w:flyingWing2[4].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing2Tween45 = new TWEEN.Tween({x:flyingWing2[4].x, y:flyingWing2[4].y, z:flyingWing2[4].z, w:flyingWing2[4].w}, fly).to({x:flyingWing2[5].x, y:flyingWing2[5].y, z:flyingWing2[5].z, w:flyingWing2[5].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing2Tween56 = new TWEEN.Tween({x:flyingWing2[5].x, y:flyingWing2[5].y, z:flyingWing2[5].z, w:flyingWing2[5].w}, fly).to({x:flyingWing2[6].x, y:flyingWing2[6].y, z:flyingWing2[6].z, w:flyingWing2[6].w}, 50).easing(TWEEN.Easing.Exponential.InOut);
    const Wing2Tween67 = new TWEEN.Tween({x:flyingWing2[6].x, y:flyingWing2[6].y, z:flyingWing2[6].z, w:flyingWing2[6].w}, fly).to({x:flyingWing2[7].x, y:flyingWing2[7].y, z:flyingWing2[7].z, w:flyingWing2[7].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing2Tween78 = new TWEEN.Tween({x:flyingWing2[7].x, y:flyingWing2[7].y, z:flyingWing2[7].z, w:flyingWing2[7].w}, fly).to({x:flyingWing2[8].x, y:flyingWing2[8].y, z:flyingWing2[8].z, w:flyingWing2[8].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing2Tween89 = new TWEEN.Tween({x:flyingWing2[8].x, y:flyingWing2[8].y, z:flyingWing2[8].z, w:flyingWing2[8].w}, fly).to({x:flyingWing2[9].x, y:flyingWing2[9].y, z:flyingWing2[9].z, w:flyingWing2[9].w}, 150).easing(TWEEN.Easing.Exponential.InOut);
    const Wing2Tween910 = new TWEEN.Tween({x:flyingWing2[9].x, y:flyingWing2[9].y, z:flyingWing2[9].z, w:flyingWing2[9].w}, fly).to({x:flyingWing2[10].x, y:flyingWing2[10].y, z:flyingWing2[10].z, w:flyingWing2[10].w}, 150).easing(TWEEN.Easing.Exponential.InOut);
    const Wing2Tween1011 = new TWEEN.Tween({x:flyingWing2[10].x, y:flyingWing2[10].y, z:flyingWing2[10].z, w:flyingWing2[10].w}, fly).to({x:flyingWing2[11].x, y:flyingWing2[11].y, z:flyingWing2[11].z, w:flyingWing2[11].w}, 50).easing(TWEEN.Easing.Exponential.InOut);
    const Wing2Tween1112 = new TWEEN.Tween({x:flyingWing2[11].x, y:flyingWing2[11].y, z:flyingWing2[11].z, w:flyingWing2[11].w}, fly).to({x:flyingWing2[12].x, y:flyingWing2[12].y, z:flyingWing2[12].z, w:flyingWing2[12].w}, 100).easing(TWEEN.Easing.Exponential.InOut);

    Wing2Tween01.chain(Wing2Tween12);
    Wing2Tween12.chain(Wing2Tween23);
    Wing2Tween23.chain(Wing2Tween34);
    Wing2Tween34.chain(Wing2Tween45);
    Wing2Tween45.chain(Wing2Tween56);
    Wing2Tween56.chain(Wing2Tween67);
    Wing2Tween67.chain(Wing2Tween78);
    Wing2Tween78.chain(Wing2Tween89);
    Wing2Tween89.chain(Wing2Tween910);
    Wing2Tween910.chain(Wing2Tween1011);
    Wing2Tween1011.chain(Wing2Tween1112);
    Wing2Tween1112.chain(Wing2Tween01);

    Wing2Tween01.onUpdate(updateFunc2);
    Wing2Tween12.onUpdate(updateFunc2);
    Wing2Tween23.onUpdate(updateFunc2);
    Wing2Tween34.onUpdate(updateFunc2);
    Wing2Tween45.onUpdate(updateFunc2);
    Wing2Tween56.onUpdate(updateFunc2);
    Wing2Tween67.onUpdate(updateFunc2);
    Wing2Tween78.onUpdate(updateFunc2);
    Wing2Tween89.onUpdate(updateFunc2);
    Wing2Tween910.onUpdate(updateFunc2);
    Wing2Tween1011.onUpdate(updateFunc2);
    Wing2Tween1112.onUpdate(updateFunc2);

    Wing2Tween01.start();


    const Wing3LQuad = new THREE.Quaternion().copy(Wing3L.quaternion);
    const Wing3RQuad = new THREE.Quaternion().copy(Wing3R.quaternion);

    const updateFunc3 = (quad) => {
                                    Wing3L.quaternion.multiplyQuaternions(Wing3LQuad, new THREE.Quaternion(quad.x, quad.y, quad.z, quad.w));
                                    Wing3R.quaternion.multiplyQuaternions(Wing3RQuad, new THREE.Quaternion(-quad.x, -quad.y, -quad.z, quad.w));
                                }

    const Wing3Tween01 = new TWEEN.Tween({x:flyingWing3[0].x, y:flyingWing3[0].y, z:flyingWing3[0].z, w:flyingWing3[0].w}, fly).to({x:flyingWing3[1].x, y:flyingWing3[1].y, z:flyingWing3[1].z, w:flyingWing3[1].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing3Tween12 = new TWEEN.Tween({x:flyingWing3[1].x, y:flyingWing3[1].y, z:flyingWing3[1].z, w:flyingWing3[1].w}, fly).to({x:flyingWing3[2].x, y:flyingWing3[2].y, z:flyingWing3[2].z, w:flyingWing3[2].w}, 50).easing(TWEEN.Easing.Exponential.InOut);
    const Wing3Tween23 = new TWEEN.Tween({x:flyingWing3[2].x, y:flyingWing3[2].y, z:flyingWing3[2].z, w:flyingWing3[2].w}, fly).to({x:flyingWing3[3].x, y:flyingWing3[3].y, z:flyingWing3[3].z, w:flyingWing3[3].w}, 50).easing(TWEEN.Easing.Exponential.InOut);
    const Wing3Tween34 = new TWEEN.Tween({x:flyingWing3[3].x, y:flyingWing3[3].y, z:flyingWing3[3].z, w:flyingWing3[3].w}, fly).to({x:flyingWing3[4].x, y:flyingWing3[4].y, z:flyingWing3[4].z, w:flyingWing3[4].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing3Tween45 = new TWEEN.Tween({x:flyingWing3[4].x, y:flyingWing3[4].y, z:flyingWing3[4].z, w:flyingWing3[4].w}, fly).to({x:flyingWing3[5].x, y:flyingWing3[5].y, z:flyingWing3[5].z, w:flyingWing3[5].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing3Tween56 = new TWEEN.Tween({x:flyingWing3[5].x, y:flyingWing3[5].y, z:flyingWing3[5].z, w:flyingWing3[5].w}, fly).to({x:flyingWing3[6].x, y:flyingWing3[6].y, z:flyingWing3[6].z, w:flyingWing3[6].w}, 50).easing(TWEEN.Easing.Exponential.InOut);
    const Wing3Tween67 = new TWEEN.Tween({x:flyingWing3[6].x, y:flyingWing3[6].y, z:flyingWing3[6].z, w:flyingWing3[6].w}, fly).to({x:flyingWing3[7].x, y:flyingWing3[7].y, z:flyingWing3[7].z, w:flyingWing3[7].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing3Tween78 = new TWEEN.Tween({x:flyingWing3[7].x, y:flyingWing3[7].y, z:flyingWing3[7].z, w:flyingWing3[7].w}, fly).to({x:flyingWing3[8].x, y:flyingWing3[8].y, z:flyingWing3[8].z, w:flyingWing3[8].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing3Tween89 = new TWEEN.Tween({x:flyingWing3[8].x, y:flyingWing3[8].y, z:flyingWing3[8].z, w:flyingWing3[8].w}, fly).to({x:flyingWing3[9].x, y:flyingWing3[9].y, z:flyingWing3[9].z, w:flyingWing3[9].w}, 150).easing(TWEEN.Easing.Exponential.InOut);
    const Wing3Tween910 = new TWEEN.Tween({x:flyingWing3[9].x, y:flyingWing3[9].y, z:flyingWing3[9].z, w:flyingWing3[9].w}, fly).to({x:flyingWing3[10].x, y:flyingWing3[10].y, z:flyingWing3[10].z, w:flyingWing3[10].w}, 150).easing(TWEEN.Easing.Exponential.InOut);
    const Wing3Tween1011 = new TWEEN.Tween({x:flyingWing3[10].x, y:flyingWing3[10].y, z:flyingWing3[10].z, w:flyingWing3[10].w}, fly).to({x:flyingWing3[11].x, y:flyingWing3[11].y, z:flyingWing3[11].z, w:flyingWing3[11].w}, 50).easing(TWEEN.Easing.Exponential.InOut);
    const Wing3Tween1112 = new TWEEN.Tween({x:flyingWing3[11].x, y:flyingWing3[11].y, z:flyingWing3[11].z, w:flyingWing3[11].w}, fly).to({x:flyingWing3[12].x, y:flyingWing3[12].y, z:flyingWing3[12].z, w:flyingWing3[12].w}, 100).easing(TWEEN.Easing.Exponential.InOut);

    Wing3Tween01.chain(Wing3Tween12);
    Wing3Tween12.chain(Wing3Tween23);
    Wing3Tween23.chain(Wing3Tween34);
    Wing3Tween34.chain(Wing3Tween45);
    Wing3Tween45.chain(Wing3Tween56);
    Wing3Tween56.chain(Wing3Tween67);
    Wing3Tween67.chain(Wing3Tween78);
    Wing3Tween78.chain(Wing3Tween89);
    Wing3Tween89.chain(Wing3Tween910);
    Wing3Tween910.chain(Wing3Tween1011);
    Wing3Tween1011.chain(Wing3Tween1112);
    Wing3Tween1112.chain(Wing3Tween01);

    Wing3Tween01.onUpdate(updateFunc3);
    Wing3Tween12.onUpdate(updateFunc3);
    Wing3Tween23.onUpdate(updateFunc3);
    Wing3Tween34.onUpdate(updateFunc3);
    Wing3Tween45.onUpdate(updateFunc3);
    Wing3Tween56.onUpdate(updateFunc3);
    Wing3Tween67.onUpdate(updateFunc3);
    Wing3Tween78.onUpdate(updateFunc3);
    Wing3Tween89.onUpdate(updateFunc3);
    Wing3Tween910.onUpdate(updateFunc3);
    Wing3Tween1011.onUpdate(updateFunc3);
    Wing3Tween1112.onUpdate(updateFunc3);

    Wing3Tween01.start();


    const Wing4LQuad = new THREE.Quaternion().copy(Wing4L.quaternion);
    const Wing4RQuad = new THREE.Quaternion().copy(Wing4R.quaternion);

    const updateFunc4 = (quad) => {
                                    Wing4L.quaternion.multiplyQuaternions(Wing4LQuad, new THREE.Quaternion(quad.x, quad.y, quad.z, quad.w));
                                    Wing4R.quaternion.multiplyQuaternions(Wing4RQuad, new THREE.Quaternion(-quad.x, -quad.y, -quad.z, quad.w));
                                }

    const Wing4Tween01 = new TWEEN.Tween({x:flyingWing4[0].x, y:flyingWing4[0].y, z:flyingWing4[0].z, w:flyingWing4[0].w}, fly).to({x:flyingWing4[1].x, y:flyingWing4[1].y, z:flyingWing4[1].z, w:flyingWing4[1].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing4Tween12 = new TWEEN.Tween({x:flyingWing4[1].x, y:flyingWing4[1].y, z:flyingWing4[1].z, w:flyingWing4[1].w}, fly).to({x:flyingWing4[2].x, y:flyingWing4[2].y, z:flyingWing4[2].z, w:flyingWing4[2].w}, 50).easing(TWEEN.Easing.Exponential.InOut);
    const Wing4Tween23 = new TWEEN.Tween({x:flyingWing4[2].x, y:flyingWing4[2].y, z:flyingWing4[2].z, w:flyingWing4[2].w}, fly).to({x:flyingWing4[3].x, y:flyingWing4[3].y, z:flyingWing4[3].z, w:flyingWing4[3].w}, 50).easing(TWEEN.Easing.Exponential.InOut);
    const Wing4Tween34 = new TWEEN.Tween({x:flyingWing4[3].x, y:flyingWing4[3].y, z:flyingWing4[3].z, w:flyingWing4[3].w}, fly).to({x:flyingWing4[4].x, y:flyingWing4[4].y, z:flyingWing4[4].z, w:flyingWing4[4].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing4Tween45 = new TWEEN.Tween({x:flyingWing4[4].x, y:flyingWing4[4].y, z:flyingWing4[4].z, w:flyingWing4[4].w}, fly).to({x:flyingWing4[5].x, y:flyingWing4[5].y, z:flyingWing4[5].z, w:flyingWing4[5].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing4Tween56 = new TWEEN.Tween({x:flyingWing4[5].x, y:flyingWing4[5].y, z:flyingWing4[5].z, w:flyingWing4[5].w}, fly).to({x:flyingWing4[6].x, y:flyingWing4[6].y, z:flyingWing4[6].z, w:flyingWing4[6].w}, 50).easing(TWEEN.Easing.Exponential.InOut);
    const Wing4Tween67 = new TWEEN.Tween({x:flyingWing4[6].x, y:flyingWing4[6].y, z:flyingWing4[6].z, w:flyingWing4[6].w}, fly).to({x:flyingWing4[7].x, y:flyingWing4[7].y, z:flyingWing4[7].z, w:flyingWing4[7].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing4Tween78 = new TWEEN.Tween({x:flyingWing4[7].x, y:flyingWing4[7].y, z:flyingWing4[7].z, w:flyingWing4[7].w}, fly).to({x:flyingWing4[8].x, y:flyingWing4[8].y, z:flyingWing4[8].z, w:flyingWing4[8].w}, 100).easing(TWEEN.Easing.Exponential.InOut);
    const Wing4Tween89 = new TWEEN.Tween({x:flyingWing4[8].x, y:flyingWing4[8].y, z:flyingWing4[8].z, w:flyingWing4[8].w}, fly).to({x:flyingWing4[9].x, y:flyingWing4[9].y, z:flyingWing4[9].z, w:flyingWing4[9].w}, 150).easing(TWEEN.Easing.Exponential.InOut);
    const Wing4Tween910 = new TWEEN.Tween({x:flyingWing4[9].x, y:flyingWing4[9].y, z:flyingWing4[9].z, w:flyingWing4[9].w}, fly).to({x:flyingWing4[10].x, y:flyingWing4[10].y, z:flyingWing4[10].z, w:flyingWing4[10].w}, 150).easing(TWEEN.Easing.Exponential.InOut);
    const Wing4Tween1011 = new TWEEN.Tween({x:flyingWing4[10].x, y:flyingWing4[10].y, z:flyingWing4[10].z, w:flyingWing4[10].w}, fly).to({x:flyingWing4[11].x, y:flyingWing4[11].y, z:flyingWing4[11].z, w:flyingWing4[11].w}, 50).easing(TWEEN.Easing.Exponential.InOut);
    const Wing4Tween1112 = new TWEEN.Tween({x:flyingWing4[11].x, y:flyingWing4[11].y, z:flyingWing4[11].z, w:flyingWing4[11].w}, fly).to({x:flyingWing4[12].x, y:flyingWing4[12].y, z:flyingWing4[12].z, w:flyingWing4[12].w}, 100).easing(TWEEN.Easing.Exponential.InOut);

    Wing4Tween01.chain(Wing4Tween12);
    Wing4Tween12.chain(Wing4Tween23);
    Wing4Tween23.chain(Wing4Tween34);
    Wing4Tween34.chain(Wing4Tween45);
    Wing4Tween45.chain(Wing4Tween56);
    Wing4Tween56.chain(Wing4Tween67);
    Wing4Tween67.chain(Wing4Tween78);
    Wing4Tween78.chain(Wing4Tween89);
    Wing4Tween89.chain(Wing4Tween910);
    Wing4Tween910.chain(Wing4Tween1011);
    Wing4Tween1011.chain(Wing4Tween1112);
    Wing4Tween1112.chain(Wing4Tween01);

    Wing4Tween01.onUpdate(updateFunc4);
    Wing4Tween12.onUpdate(updateFunc4);
    Wing4Tween23.onUpdate(updateFunc4);
    Wing4Tween34.onUpdate(updateFunc4);
    Wing4Tween45.onUpdate(updateFunc4);
    Wing4Tween56.onUpdate(updateFunc4);
    Wing4Tween67.onUpdate(updateFunc4);
    Wing4Tween78.onUpdate(updateFunc4);
    Wing4Tween89.onUpdate(updateFunc4);
    Wing4Tween910.onUpdate(updateFunc4);
    Wing4Tween1011.onUpdate(updateFunc4);
    Wing4Tween1112.onUpdate(updateFunc4);

    Wing4Tween01.start();
}

function AnimRunSetup() {

  const wizard = gameObjects.find((elem)=>elem.name == 'wizard');
  const root = wizard.root;

  
  let LowerLegR;
  let UpperLegR;
  let LowerLegL;
  let UpperLegL;
  let UpperArmR;
  let LowerArmR;
  let UpperArmL;
  let LowerArmL;
  let Torso;
  let Abdomen;
  let Body;
  let Neck;
  let Head;
  
  
  LowerLegR = root.getObjectByName('LowerLegR');
  UpperLegR = root.getObjectByName('UpperLegR');
  LowerLegL = root.getObjectByName('LowerLegL');
  UpperLegL = root.getObjectByName('UpperLegL');
  UpperArmR = root.getObjectByName('UpperArmR');
  LowerArmR = root.getObjectByName('LowerArmR');
  UpperArmL = root.getObjectByName('UpperArmL');
  LowerArmL = root.getObjectByName('LowerArmL');
  Torso = root.getObjectByName('Torso');
  Abdomen = root.getObjectByName('Abdomen');
  Body = root.getObjectByName('Body');
  Neck = root.getObjectByName('Neck');
  Head = root.getObjectByName('Head');

  // 0 - 1 - 2 - 4 - 5 - 6 - 7 - 9 -> 18 - 21
const runUpperLegL = [
  {qx:0.096, qy:0.003, qz:0.000, qw:0.995},
  {qx:0.103, qy:0.003, qz:0.000, qw:0.995},
  {qx:0.125, qy:0.003, qz:0.000, qw:0.992},
  {qx:0.084, qy:0.000, qz:-0.002, qw:0.996},
  {qx:0.079, qy:0.000, qz:-0.003, qw:0.997},
  {qx:-0.027, qy:0.000, qz:0.000, qw:1.000},
  {qx:-0.296, qy:0.001, qz:0.004, qw:0.955}, // 7
  {qx:-0.522, qy:0.000, qz:0.000, qw:0.853}, // 9
  {qx:-0.515, qy:-0.001, qz:0.000, qw:0.857},
  {qx:-0.478, qy:-0.002, qz:0.000, qw:0.878},
  {qx:-0.401, qy:-0.003, qz:0.000, qw:0.916},
  {qx:-0.408, qy:-0.003, qz:0.000, qw:0.913},
  {qx:-0.486, qy:-0.003, qz:0.000, qw:0.874},
  {qx:-0.506, qy:-0.002, qz:0.000, qw:0.862},
  {qx:-0.451, qy:-0.001, qz:0.001, qw:0.892},
  {qx:-0.217, qy:-0.000, qz:0.000, qw:0.976},
  {qx:0.049, qy:-0.000, qz:0.000, qw:0.999},
  {qx:0.096, qy:0.003, qz:0.000, qw:0.995} 
];
const runLowerLegL = [
  {qx:0.559, qy:0.000, qz:0.000, qw:0.829},
  {qx:0.540, qy:0.000, qz:0.000, qw:0.841},
  {qx:0.484, qy:0.000, qz:0.000, qw:0.875}, //2
  {qx:0.636, qy:0.000, qz:0.000, qw:0.772}, //4
  {qx:0.668, qy:0.000, qz:0.000, qw:0.744},
  {qx:0.740, qy:0.000, qz:0.000, qw:0.672},
  {qx:0.776, qy:0.000, qz:0.000, qw:0.631},
  {qx:0.496, qy:0.000, qz:0.000, qw:0.868}, //9
  {qx:0.397, qy:0.000, qz:0.000, qw:0.918},
  {qx:0.344, qy:0.000, qz:0.000, qw:0.939},
  {qx:0.198, qy:0.000, qz:0.000, qw:0.980},
  {qx:0.211, qy:0.000, qz:0.000, qw:0.977},
  {qx:0.389, qy:0.000, qz:0.000, qw:0.921},
  {qx:0.508, qy:0.000, qz:0.000, qw:0.861},
  {qx:0.596, qy:0.000, qz:0.000, qw:0.803},
  {qx:0.441, qy:0.000, qz:0.000, qw:0.897},
  {qx:0.151, qy:0.000, qz:0.000, qw:0.988},
  {qx:0.559, qy:0.000, qz:0.000, qw:0.829},
];

const runUpperLegR = [
  {rx:-57.9, ry:0.171, rz:-0.042},
  {rx:-54.5, ry:0.205, rz:-0.045},
  {rx:-43.1, ry:0.286, rz:-0.036},
  {rx:-56.7, ry:0.352, rz:-0.142}, //4
  {rx:-60.4, ry:0.313, rz:-0.164},
  {rx:-40, ry:-0.011, rz:-0.22},
  {rx:24.1, ry:-0.142, rz:0.206},
  {rx:8.75, ry:-0.275, rz:-0.025},
  {rx:6.98, ry:-0.287, rz:-0.081},
  {rx:8.79, ry:-0.291, rz:-0.050},
  {rx:10, ry:-0.263, rz:0.008},
  {rx:10.8, ry:-0.19, rz:0.121},
  {rx:12, ry:-0.092, rz:0.322},
  {rx:6.09, ry:-0.009, rz:0.32},
  {rx:-8.9, ry:0.005, rz:0.000},
  {rx:-32.3, ry:-0.245, rz:-0.37},
  {rx:-46.1, ry:-0.204, rz:-0.218},
  {rx:-57.9, ry:0.171, rz:-0.042}
];
const runLowerLegR = [
  {qx:0.355, qy:0.000, qz:0.000, qw:0.935},
  {qx:0.315, qy:0.000, qz:0.000, qw:0.949},
  {qx:0.169, qy:0.000, qz:0.000, qw:0.986},
  {qx:0.338, qy:0.000, qz:0.000, qw:0.941},
  {qx:0.413, qy:0.000, qz:0.000, qw:0.911},
  {qx:0.626, qy:0.000, qz:0.000, qw:0.780},
  {qx:0.119, qy:0.000, qz:0.000, qw:0.993},
  {qx:0.533, qy:0.000, qz:0.000, qw:0.846},
  {qx:0.651, qy:0.000, qz:0.000, qw:0.759},
  {qx:0.615, qy:0.000, qz:0.000, qw:0.789},
  {qx:0.572, qy:0.000, qz:0.000, qw:0.821},
  {qx:0.579, qy:0.000, qz:0.000, qw:0.815},
  {qx:0.620, qy:0.000, qz:0.000, qw:0.785},
  {qx:0.683, qy:0.000, qz:0.000, qw:0.731},
  {qx:0.757, qy:0.000, qz:0.000, qw:0.653},
  {qx:0.745, qy:0.000, qz:0.000, qw:0.667},
  {qx:0.617, qy:0.000, qz:0.000, qw:0.787},
  {qx:0.355, qy:0.000, qz:0.000, qw:0.935},
  
];

const runUpperArmL = [
  {qx:-0.579, qy:-0.251, qz:-0.197, qw:0.750},
  {qx:-0.575, qy:-0.226, qz:-0.233, qw:0.757},
  {qx:-0.567, qy:-0.177, qz:-0.268, qw:0.772},
  {qx:-0.554, qy:-0.111, qz:-0.157, qw:0.823},
  {qx:-0.545, qy:-0.041, qz:-0.072, qw:0.834},
  {qx:-0.534, qy:0.084, qz:0.010, qw:0.806},
  {qx:-0.521, qy:0.265, qz:0.107, qw:0.726},
  {qx:-0.491, qy:0.589, qz:0.279, qw:0.542},
  {qx:-0.476, qy:0.635, qz:0.327, qw:0.514},
  {qx:-0.454, qy:0.626, qz:0.349, qw:0.558},
  {qx:-0.442, qy:0.591, qz:0.352, qw:0.632},
  {qx:-0.447, qy:0.538, qz:0.337, qw:0.689},
  {qx:-0.459, qy:0.466, qz:0.290, qw:0.741},
  {qx:-0.474, qy:0.381, qz:0.232, qw:0.759},
  {qx:-0.491, qy:0.275, qz:0.163, qw:0.759},
  {qx:-0.514, qy:0.137, qz:0.071, qw:0.757},
  {qx:-0.539, qy:-0.012, qz:-0.032, qw:0.755},
  {qx:-0.579, qy:-0.251, qz:-0.197, qw:0.750}
];
const runLowerArmL = [
  {qx:-0.034, qy:0.042, qz:-0.586, qw:0.808},
  {qx:-0.091, qy:-0.047, qz:-0.589, qw:0.794},
  {qx:-0.148, qy:-0.143, qz:-0.606, qw:0.764},
  {qx:-0.096, qy:-0.150, qz:-0.695, qw:0.692},
  {qx:-0.061, qy:-0.157, qz:-0.716, qw:0.677},
  {qx:-0.031, qy:-0.190, qz:-0.704, qw:0.678},
  {qx:0.002, qy:-0.259, qz:-0.670, qw:0.680},
  {qx:0.034, qy:-0.349, qz:-0.589, qw:0.700},
  {qx:0.000, qy:-0.326, qz:-0.561, qw:0.738},
  {qx:-0.085, qy:-0.247, qz:-0.522, qw:0.798},
  {qx:-0.141, qy:-0.194, qz:-0.499, qw:0.833},
  {qx:-0.072, qy:-0.256, qz:-0.497, qw:0.820},
  {qx:-0.072, qy:-0.250, qz:-0.525, qw:0.789},
  {qx:-0.073, qy:-0.228, qz:-0.596, qw:0.746},
  {qx:-0.075, qy:-0.194, qz:-0.668, qw:0.710},
  {qx:-0.075, qy:-0.156, qz:-0.695, qw:0.698},
  {qx:-0.069, qy:-0.105, qz:-0.680, qw:0.713},
  {qx:-0.034, qy:0.042, qz:-0.586, qw:0.808}
];

const runUpperArmR = [
  {qx:-0.473, qy:-0.373, qz:-0.319, qw:0.732},
  {qx:-0.459, qy:-0.373, qz:-0.332, qw:0.733},
  {qx:-0.446, qy:-0.369, qz:-0.345, qw:0.741},
  {qx:-0.511, qy:-0.200, qz:-0.233, qw:0.800},
  {qx:-0.551, qy:-0.084, qz:-0.154, qw:0.816},
  {qx:-0.581, qy:0.022, qz:-0.079, qw:0.797},
  {qx:-0.612, qy:0.146, qz:0.010, qw:0.746},
  {qx:-0.655, qy:0.340, qz:0.150, qw:0.630},
  {qx:-0.660, qy:0.365, qz:0.169, qw:0.611},
  {qx:-0.652, qy:0.358, qz:0.163, qw:0.631},
  {qx:-0.626, qy:0.336, qz:0.143, qw:0.685},
  {qx:-0.591, qy:0.294, qz:0.109, qw:0.755},
  {qx:-0.556, qy:0.238, qz:0.066, qw:0.809},
  {qx:-0.532, qy:0.175, qz:0.022, qw:0.828},
  {qx:-0.515, qy:0.092, qz:-0.032, qw:0.822},
  {qx:-0.499, qy:-0.025, qz:-0.105, qw:0.805},
  {qx:-0.487, qy:-0.156, qz:-0.186, qw:0.780},
  {qx:-0.473, qy:-0.373, qz:-0.319, qw:0.732}
];
const runLowerArmR = [
  {qx:0.170, qy:-0.365, qz:0.339, qw:0.850},
  {qx:0.103, qy:-0.097, qz:0.314, qw:0.893},
  {qx:0.037, qy:0.171, qz:0.289, qw:0.936},
  {qx:0.081, qy:0.037, qz:0.429, qw:0.826},
  {qx:0.122, qy:-0.104, qz:0.561, qw:0.721},
  {qx:0.155, qy:-0.239, qz:0.664, qw:0.639},
  {qx:0.166, qy:-0.330, qz:0.710, qw:0.610},
  {qx:0.046, qy:-0.415, qz:0.610, qw:0.709},
  {qx:-0.021, qy:-0.421, qz:0.581, qw:0.741},
  {qx:-0.059, qy:-0.382, qz:0.600, qw:0.728},
  {qx:-0.089, qy:-0.274, qz:0.655, qw:0.690},
  {qx:-0.108, qy:-0.135, qz:0.724, qw:0.642},
  {qx:-0.117, qy:-0.026, qz:0.778, qw:0.605},
  {qx:-0.119, qy:0.012, qz:0.797, qw:0.592},
  {qx:-0.101, qy:-0.011, qz:0.769, qw:0.608},
  {qx:-0.049, qy:-0.079, qz:0.687, qw:0.654},
  {qx:0.025, qy:-0.177, qz:0.568, qw:0.721},
  {qx:0.170, qy:-0.365, qz:0.339, qw:0.850}
];

const runTorso = [
  {qx:0.000, qy:-0.124, qz:0.056, qw:0.991},
  {qx:0.000, qy:0.060, qz:-0.027, qw:0.998},
  {qx:0.000, qy:-0.124, qz:0.056, qw:0.991}
];

const runAbdomen = [
  {qx:0.169, qy:0.000, qz:0.000, qw:0.986},
  {qx:0.169, qy:0.000, qz:0.000, qw:0.986},
  {qx:0.182, qy:0.000, qz:0.000, qw:0.983},
  {qx:0.169, qy:0.000, qz:0.000, qw:0.986},
  {qx:0.169, qy:0.000, qz:0.000, qw:0.986},
  {qx:0.182, qy:0.000, qz:0.000, qw:0.983},
  {qx:0.169, qy:0.000, qz:0.000, qw:0.986}
];

const runBody = [
  {tx: 0.000, ty:-0.009, tz:-0.002},
  {tx: 0.000, ty:0.000, tz:0.000},
  {tx: 0.000, ty:0.000, tz:0.000},
  {tx: 0.000, ty:-0.335, tz:-0.091},
  {tx: 0.000, ty:-0.335, tz:-0.091},
  {tx: 0.000, ty:-0.009, tz:-0.002},
  {tx: 0.000, ty:-0.009, tz:-0.002},
  {tx: 0.000, ty:-0.009, tz:-0.002},
  {tx: 0.000, ty:-0.289, tz:-0.092},
  {tx: 0.000, ty:-0.335, tz:-0.092},
  {tx: 0.000, ty:-0.335, tz:-0.052},
  {tx: 0.000, ty:-0.009, tz:-0.002},
  {tx: 0.000, ty:-0.009, tz:-0.002}, 
];


  const UpperLegLQuad = new THREE.Quaternion().copy(UpperLegL.quaternion);
  
  let updateFunc = (transf) => {
    UpperLegL.quaternion.multiplyQuaternions(UpperLegLQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  };

  const UpperLegLTween01 = new TWEEN.Tween({qx:runUpperLegL[0].qx, qy:runUpperLegL[0].qy, qz:runUpperLegL[0].qz, qw:runUpperLegL[0].qw}, run).to({qx:runUpperLegL[1].qx, qy:runUpperLegL[1].qy, qz:runUpperLegL[1].qz, qw:runUpperLegL[1].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegLTween12 = new TWEEN.Tween({qx:runUpperLegL[1].qx, qy:runUpperLegL[1].qy, qz:runUpperLegL[1].qz, qw:runUpperLegL[1].qw}, run).to({qx:runUpperLegL[2].qx, qy:runUpperLegL[2].qy, qz:runUpperLegL[2].qz, qw:runUpperLegL[2].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegLTween23 = new TWEEN.Tween({qx:runUpperLegL[2].qx, qy:runUpperLegL[2].qy, qz:runUpperLegL[2].qz, qw:runUpperLegL[2].qw}, run).to({qx:runUpperLegL[3].qx, qy:runUpperLegL[3].qy, qz:runUpperLegL[3].qz, qw:runUpperLegL[3].qw}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegLTween34 = new TWEEN.Tween({qx:runUpperLegL[3].qx, qy:runUpperLegL[3].qy, qz:runUpperLegL[3].qz, qw:runUpperLegL[3].qw}, run).to({qx:runUpperLegL[4].qx, qy:runUpperLegL[4].qy, qz:runUpperLegL[4].qz, qw:runUpperLegL[4].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegLTween45 = new TWEEN.Tween({qx:runUpperLegL[4].qx, qy:runUpperLegL[4].qy, qz:runUpperLegL[4].qz, qw:runUpperLegL[4].qw}, run).to({qx:runUpperLegL[5].qx, qy:runUpperLegL[5].qy, qz:runUpperLegL[5].qz, qw:runUpperLegL[5].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegLTween56 = new TWEEN.Tween({qx:runUpperLegL[5].qx, qy:runUpperLegL[5].qy, qz:runUpperLegL[5].qz, qw:runUpperLegL[5].qw}, run).to({qx:runUpperLegL[6].qx, qy:runUpperLegL[6].qy, qz:runUpperLegL[6].qz, qw:runUpperLegL[6].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegLTween67 = new TWEEN.Tween({qx:runUpperLegL[6].qx, qy:runUpperLegL[6].qy, qz:runUpperLegL[6].qz, qw:runUpperLegL[6].qw}, run).to({qx:runUpperLegL[7].qx, qy:runUpperLegL[7].qy, qz:runUpperLegL[7].qz, qw:runUpperLegL[7].qw}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegLTween78 = new TWEEN.Tween({qx:runUpperLegL[7].qx, qy:runUpperLegL[7].qy, qz:runUpperLegL[7].qz, qw:runUpperLegL[7].qw}, run).to({qx:runUpperLegL[8].qx, qy:runUpperLegL[8].qy, qz:runUpperLegL[8].qz, qw:runUpperLegL[8].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegLTween89 = new TWEEN.Tween({qx:runUpperLegL[8].qx, qy:runUpperLegL[8].qy, qz:runUpperLegL[8].qz, qw:runUpperLegL[8].qw}, run).to({qx:runUpperLegL[9].qx, qy:runUpperLegL[9].qy, qz:runUpperLegL[9].qz, qw:runUpperLegL[9].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegLTween910 = new TWEEN.Tween({qx:runUpperLegL[9].qx, qy:runUpperLegL[9].qy, qz:runUpperLegL[9].qz, qw:runUpperLegL[9].qw}, run).to({qx:runUpperLegL[10].qx, qy:runUpperLegL[10].qy, qz:runUpperLegL[10].qz, qw:runUpperLegL[10].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegLTween1011 = new TWEEN.Tween({qx:runUpperLegL[10].qx, qy:runUpperLegL[10].qy, qz:runUpperLegL[10].qz, qw:runUpperLegL[10].qw}, run).to({qx:runUpperLegL[11].qx, qy:runUpperLegL[11].qy, qz:runUpperLegL[11].qz, qw:runUpperLegL[11].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegLTween1112 = new TWEEN.Tween({qx:runUpperLegL[11].qx, qy:runUpperLegL[11].qy, qz:runUpperLegL[11].qz, qw:runUpperLegL[11].qw}, run).to({qx:runUpperLegL[12].qx, qy:runUpperLegL[12].qy, qz:runUpperLegL[12].qz, qw:runUpperLegL[12].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegLTween1213 = new TWEEN.Tween({qx:runUpperLegL[12].qx, qy:runUpperLegL[12].qy, qz:runUpperLegL[12].qz, qw:runUpperLegL[12].qw}, run).to({qx:runUpperLegL[13].qx, qy:runUpperLegL[13].qy, qz:runUpperLegL[13].qz, qw:runUpperLegL[13].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegLTween1314 = new TWEEN.Tween({qx:runUpperLegL[13].qx, qy:runUpperLegL[13].qy, qz:runUpperLegL[13].qz, qw:runUpperLegL[13].qw}, run).to({qx:runUpperLegL[14].qx, qy:runUpperLegL[14].qy, qz:runUpperLegL[14].qz, qw:runUpperLegL[14].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegLTween1415 = new TWEEN.Tween({qx:runUpperLegL[14].qx, qy:runUpperLegL[14].qy, qz:runUpperLegL[14].qz, qw:runUpperLegL[14].qw}, run).to({qx:runUpperLegL[15].qx, qy:runUpperLegL[15].qy, qz:runUpperLegL[15].qz, qw:runUpperLegL[15].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegLTween1516 = new TWEEN.Tween({qx:runUpperLegL[15].qx, qy:runUpperLegL[15].qy, qz:runUpperLegL[15].qz, qw:runUpperLegL[15].qw}, run).to({qx:runUpperLegL[16].qx, qy:runUpperLegL[16].qy, qz:runUpperLegL[16].qz, qw:runUpperLegL[16].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegLTween1617 = new TWEEN.Tween({qx:runUpperLegL[16].qx, qy:runUpperLegL[16].qy, qz:runUpperLegL[16].qz, qw:runUpperLegL[16].qw}, run).to({qx:runUpperLegL[17].qx, qy:runUpperLegL[17].qy, qz:runUpperLegL[17].qz, qw:runUpperLegL[17].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
 
  UpperLegLTween01.chain(UpperLegLTween12);
  UpperLegLTween12.chain(UpperLegLTween23);
  UpperLegLTween23.chain(UpperLegLTween34);
  UpperLegLTween34.chain(UpperLegLTween45);
  UpperLegLTween45.chain(UpperLegLTween56);
  UpperLegLTween56.chain(UpperLegLTween67);
  UpperLegLTween67.chain(UpperLegLTween78);
  UpperLegLTween78.chain(UpperLegLTween89);
  UpperLegLTween89.chain(UpperLegLTween910);
  UpperLegLTween910.chain(UpperLegLTween1011);
  UpperLegLTween1011.chain(UpperLegLTween1112);
  UpperLegLTween1112.chain(UpperLegLTween1213);
  UpperLegLTween1213.chain(UpperLegLTween1314);
  UpperLegLTween1314.chain(UpperLegLTween1415);
  UpperLegLTween1415.chain(UpperLegLTween1516);
  UpperLegLTween1516.chain(UpperLegLTween1617);
  UpperLegLTween1617.chain(UpperLegLTween01);

  UpperLegLTween01.onUpdate(updateFunc);
  UpperLegLTween12.onUpdate(updateFunc);
  UpperLegLTween23.onUpdate(updateFunc);
  UpperLegLTween34.onUpdate(updateFunc);
  UpperLegLTween45.onUpdate(updateFunc);
  UpperLegLTween56.onUpdate(updateFunc);
  UpperLegLTween67.onUpdate(updateFunc);
  UpperLegLTween78.onUpdate(updateFunc);
  UpperLegLTween89.onUpdate(updateFunc);
  UpperLegLTween910.onUpdate(updateFunc);
  UpperLegLTween1011.onUpdate(updateFunc);
  UpperLegLTween1112.onUpdate(updateFunc);
  UpperLegLTween1213.onUpdate(updateFunc);
  UpperLegLTween1314.onUpdate(updateFunc);
  UpperLegLTween1415.onUpdate(updateFunc);
  UpperLegLTween1516.onUpdate(updateFunc);
  UpperLegLTween1617.onUpdate(updateFunc);

  UpperLegLTween01.start();

  const LowerLegLQuad = new THREE.Quaternion().copy(LowerLegL.quaternion);

  updateFunc = (transf) => {
    LowerLegL.quaternion.multiplyQuaternions(LowerLegLQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  };

  const LowerLegLTween01 = new TWEEN.Tween({qx:runLowerLegL[0].qx, qy:runLowerLegL[0].qy, qz:runLowerLegL[0].qz, qw:runLowerLegL[0].qw}, run).to({qx:runLowerLegL[1].qx, qy:runLowerLegL[1].qy, qz:runLowerLegL[1].qz, qw:runLowerLegL[1].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegLTween12 = new TWEEN.Tween({qx:runLowerLegL[1].qx, qy:runLowerLegL[1].qy, qz:runLowerLegL[1].qz, qw:runLowerLegL[1].qw}, run).to({qx:runLowerLegL[2].qx, qy:runLowerLegL[2].qy, qz:runLowerLegL[2].qz, qw:runLowerLegL[2].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegLTween23 = new TWEEN.Tween({qx:runLowerLegL[2].qx, qy:runLowerLegL[2].qy, qz:runLowerLegL[2].qz, qw:runLowerLegL[2].qw}, run).to({qx:runLowerLegL[3].qx, qy:runLowerLegL[3].qy, qz:runLowerLegL[3].qz, qw:runLowerLegL[3].qw}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegLTween34 = new TWEEN.Tween({qx:runLowerLegL[3].qx, qy:runLowerLegL[3].qy, qz:runLowerLegL[3].qz, qw:runLowerLegL[3].qw}, run).to({qx:runLowerLegL[4].qx, qy:runLowerLegL[4].qy, qz:runLowerLegL[4].qz, qw:runLowerLegL[4].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegLTween45 = new TWEEN.Tween({qx:runLowerLegL[4].qx, qy:runLowerLegL[4].qy, qz:runLowerLegL[4].qz, qw:runLowerLegL[4].qw}, run).to({qx:runLowerLegL[5].qx, qy:runLowerLegL[5].qy, qz:runLowerLegL[5].qz, qw:runLowerLegL[5].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegLTween56 = new TWEEN.Tween({qx:runLowerLegL[5].qx, qy:runLowerLegL[5].qy, qz:runLowerLegL[5].qz, qw:runLowerLegL[5].qw}, run).to({qx:runLowerLegL[6].qx, qy:runLowerLegL[6].qy, qz:runLowerLegL[6].qz, qw:runLowerLegL[6].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegLTween67 = new TWEEN.Tween({qx:runLowerLegL[6].qx, qy:runLowerLegL[6].qy, qz:runLowerLegL[6].qz, qw:runLowerLegL[6].qw}, run).to({qx:runLowerLegL[7].qx, qy:runLowerLegL[7].qy, qz:runLowerLegL[7].qz, qw:runLowerLegL[7].qw}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegLTween78 = new TWEEN.Tween({qx:runLowerLegL[7].qx, qy:runLowerLegL[7].qy, qz:runLowerLegL[7].qz, qw:runLowerLegL[7].qw}, run).to({qx:runLowerLegL[8].qx, qy:runLowerLegL[8].qy, qz:runLowerLegL[8].qz, qw:runLowerLegL[8].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegLTween89 = new TWEEN.Tween({qx:runLowerLegL[8].qx, qy:runLowerLegL[8].qy, qz:runLowerLegL[8].qz, qw:runLowerLegL[8].qw}, run).to({qx:runLowerLegL[9].qx, qy:runLowerLegL[9].qy, qz:runLowerLegL[9].qz, qw:runLowerLegL[9].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegLTween910 = new TWEEN.Tween({qx:runLowerLegL[9].qx, qy:runLowerLegL[9].qy, qz:runLowerLegL[9].qz, qw:runLowerLegL[9].qw}, run).to({qx:runLowerLegL[10].qx, qy:runLowerLegL[10].qy, qz:runLowerLegL[10].qz, qw:runLowerLegL[10].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegLTween1011 = new TWEEN.Tween({qx:runLowerLegL[10].qx, qy:runLowerLegL[10].qy, qz:runLowerLegL[10].qz, qw:runLowerLegL[10].qw}, run).to({qx:runLowerLegL[11].qx, qy:runLowerLegL[11].qy, qz:runLowerLegL[11].qz, qw:runLowerLegL[11].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegLTween1112 = new TWEEN.Tween({qx:runLowerLegL[11].qx, qy:runLowerLegL[11].qy, qz:runLowerLegL[11].qz, qw:runLowerLegL[11].qw}, run).to({qx:runLowerLegL[12].qx, qy:runLowerLegL[12].qy, qz:runLowerLegL[12].qz, qw:runLowerLegL[12].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegLTween1213 = new TWEEN.Tween({qx:runLowerLegL[12].qx, qy:runLowerLegL[12].qy, qz:runLowerLegL[12].qz, qw:runLowerLegL[12].qw}, run).to({qx:runLowerLegL[13].qx, qy:runLowerLegL[13].qy, qz:runLowerLegL[13].qz, qw:runLowerLegL[13].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegLTween1314 = new TWEEN.Tween({qx:runLowerLegL[13].qx, qy:runLowerLegL[13].qy, qz:runLowerLegL[13].qz, qw:runLowerLegL[13].qw}, run).to({qx:runLowerLegL[14].qx, qy:runLowerLegL[14].qy, qz:runLowerLegL[14].qz, qw:runLowerLegL[14].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegLTween1415 = new TWEEN.Tween({qx:runLowerLegL[14].qx, qy:runLowerLegL[14].qy, qz:runLowerLegL[14].qz, qw:runLowerLegL[14].qw}, run).to({qx:runLowerLegL[15].qx, qy:runLowerLegL[15].qy, qz:runLowerLegL[15].qz, qw:runLowerLegL[15].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegLTween1516 = new TWEEN.Tween({qx:runLowerLegL[15].qx, qy:runLowerLegL[15].qy, qz:runLowerLegL[15].qz, qw:runLowerLegL[15].qw}, run).to({qx:runLowerLegL[16].qx, qy:runLowerLegL[16].qy, qz:runLowerLegL[16].qz, qw:runLowerLegL[16].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegLTween1617 = new TWEEN.Tween({qx:runLowerLegL[16].qx, qy:runLowerLegL[16].qy, qz:runLowerLegL[16].qz, qw:runLowerLegL[16].qw}, run).to({qx:runLowerLegL[17].qx, qy:runLowerLegL[17].qy, qz:runLowerLegL[17].qz, qw:runLowerLegL[17].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  
  LowerLegLTween01.chain(LowerLegLTween12);
  LowerLegLTween12.chain(LowerLegLTween23);
  LowerLegLTween23.chain(LowerLegLTween34);
  LowerLegLTween34.chain(LowerLegLTween45);
  LowerLegLTween45.chain(LowerLegLTween56);
  LowerLegLTween56.chain(LowerLegLTween67);
  LowerLegLTween67.chain(LowerLegLTween78);
  LowerLegLTween78.chain(LowerLegLTween89);
  LowerLegLTween89.chain(LowerLegLTween910);
  LowerLegLTween910.chain(LowerLegLTween1011);
  LowerLegLTween1011.chain(LowerLegLTween1112);
  LowerLegLTween1112.chain(LowerLegLTween1213);
  LowerLegLTween1213.chain(LowerLegLTween1314);
  LowerLegLTween1314.chain(LowerLegLTween1415);
  LowerLegLTween1415.chain(LowerLegLTween1516);
  LowerLegLTween1516.chain(LowerLegLTween1617);
  LowerLegLTween1617.chain(LowerLegLTween01);

  LowerLegLTween01.onUpdate(updateFunc);
  LowerLegLTween12.onUpdate(updateFunc);
  LowerLegLTween23.onUpdate(updateFunc);
  LowerLegLTween34.onUpdate(updateFunc);
  LowerLegLTween45.onUpdate(updateFunc);
  LowerLegLTween56.onUpdate(updateFunc);
  LowerLegLTween67.onUpdate(updateFunc);
  LowerLegLTween78.onUpdate(updateFunc);
  LowerLegLTween89.onUpdate(updateFunc);
  LowerLegLTween910.onUpdate(updateFunc);
  LowerLegLTween1011.onUpdate(updateFunc);
  LowerLegLTween1112.onUpdate(updateFunc);
  LowerLegLTween1213.onUpdate(updateFunc);
  LowerLegLTween1314.onUpdate(updateFunc);
  LowerLegLTween1415.onUpdate(updateFunc);
  LowerLegLTween1516.onUpdate(updateFunc);
  LowerLegLTween1617.onUpdate(updateFunc);
 
  LowerLegLTween01.start();


  const UpperLegRRot = new THREE.Vector3(UpperLegR.rotation.x, UpperLegR.rotation.y, UpperLegR.rotation.z);

  updateFunc = (transf) => {
    UpperLegR.rotation.setFromVector3(new THREE.Vector3().addVectors(UpperLegRRot, new THREE.Vector3(transf.rx*(Math.PI/180), transf.ry*(Math.PI/180), transf.rz*(Math.PI/180))));
  };

  const UpperLegRTween01 = new TWEEN.Tween({rx:runUpperLegR[0].rx, ry:runUpperLegR[0].ry, rz:runUpperLegR[0].rz}, run).to({rx:runUpperLegR[1].rx, ry:runUpperLegR[1].ry, rz:runUpperLegR[1].rz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegRTween12 = new TWEEN.Tween({rx:runUpperLegR[1].rx, ry:runUpperLegR[1].ry, rz:runUpperLegR[1].rz}, run).to({rx:runUpperLegR[2].rx, ry:runUpperLegR[2].ry, rz:runUpperLegR[2].rz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegRTween23 = new TWEEN.Tween({rx:runUpperLegR[2].rx, ry:runUpperLegR[2].ry, rz:runUpperLegR[2].rz}, run).to({rx:runUpperLegR[3].rx, ry:runUpperLegR[3].ry, rz:runUpperLegR[3].rz}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegRTween34 = new TWEEN.Tween({rx:runUpperLegR[3].rx, ry:runUpperLegR[3].ry, rz:runUpperLegR[3].rz}, run).to({rx:runUpperLegR[4].rx, ry:runUpperLegR[4].ry, rz:runUpperLegR[4].rz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegRTween45 = new TWEEN.Tween({rx:runUpperLegR[4].rx, ry:runUpperLegR[4].ry, rz:runUpperLegR[4].rz}, run).to({rx:runUpperLegR[5].rx, ry:runUpperLegR[5].ry, rz:runUpperLegR[5].rz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegRTween56 = new TWEEN.Tween({rx:runUpperLegR[5].rx, ry:runUpperLegR[5].ry, rz:runUpperLegR[5].rz}, run).to({rx:runUpperLegR[6].rx, ry:runUpperLegR[6].ry, rz:runUpperLegR[6].rz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegRTween67 = new TWEEN.Tween({rx:runUpperLegR[6].rx, ry:runUpperLegR[6].ry, rz:runUpperLegR[6].rz}, run).to({rx:runUpperLegR[7].rx, ry:runUpperLegR[7].ry, rz:runUpperLegR[7].rz}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegRTween78 = new TWEEN.Tween({rx:runUpperLegR[7].rx, ry:runUpperLegR[7].ry, rz:runUpperLegR[7].rz}, run).to({rx:runUpperLegR[8].rx, ry:runUpperLegR[8].ry, rz:runUpperLegR[8].rz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegRTween89 = new TWEEN.Tween({rx:runUpperLegR[8].rx, ry:runUpperLegR[8].ry, rz:runUpperLegR[8].rz}, run).to({rx:runUpperLegR[9].rx, ry:runUpperLegR[9].ry, rz:runUpperLegR[9].rz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegRTween910 = new TWEEN.Tween({rx:runUpperLegR[9].rx, ry:runUpperLegR[9].ry, rz:runUpperLegR[9].rz}, run).to({rx:runUpperLegR[10].rx, ry:runUpperLegR[10].ry, rz:runUpperLegR[10].rz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegRTween1011 = new TWEEN.Tween({rx:runUpperLegR[10].rx, ry:runUpperLegR[10].ry, rz:runUpperLegR[10].rz}, run).to({rx:runUpperLegR[11].rx, ry:runUpperLegR[11].ry, rz:runUpperLegR[11].rz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegRTween1112 = new TWEEN.Tween({rx:runUpperLegR[11].rx, ry:runUpperLegR[11].ry, rz:runUpperLegR[11].rz}, run).to({rx:runUpperLegR[12].rx, ry:runUpperLegR[12].ry, rz:runUpperLegR[12].rz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegRTween1213 = new TWEEN.Tween({rx:runUpperLegR[12].rx, ry:runUpperLegR[12].ry, rz:runUpperLegR[12].rz}, run).to({rx:runUpperLegR[13].rx, ry:runUpperLegR[13].ry, rz:runUpperLegR[13].rz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegRTween1314 = new TWEEN.Tween({rx:runUpperLegR[13].rx, ry:runUpperLegR[13].ry, rz:runUpperLegR[13].rz}, run).to({rx:runUpperLegR[14].rx, ry:runUpperLegR[14].ry, rz:runUpperLegR[14].rz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegRTween1415 = new TWEEN.Tween({rx:runUpperLegR[14].rx, ry:runUpperLegR[14].ry, rz:runUpperLegR[14].rz}, run).to({rx:runUpperLegR[15].rx, ry:runUpperLegR[15].ry, rz:runUpperLegR[15].rz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegRTween1516 = new TWEEN.Tween({rx:runUpperLegR[15].rx, ry:runUpperLegR[15].ry, rz:runUpperLegR[15].rz}, run).to({rx:runUpperLegR[16].rx, ry:runUpperLegR[16].ry, rz:runUpperLegR[16].rz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegRTween1617 = new TWEEN.Tween({rx:runUpperLegR[16].rx, ry:runUpperLegR[16].ry, rz:runUpperLegR[16].rz}, run).to({rx:runUpperLegR[17].rx, ry:runUpperLegR[17].ry, rz:runUpperLegR[17].rz}, 50).easing(TWEEN.Easing.Exponential.InOut);


  UpperLegRTween01.chain(UpperLegRTween12);
  UpperLegRTween12.chain(UpperLegRTween23);
  UpperLegRTween23.chain(UpperLegRTween34);
  UpperLegRTween34.chain(UpperLegRTween45);
  UpperLegRTween45.chain(UpperLegRTween56);
  UpperLegRTween56.chain(UpperLegRTween67);
  UpperLegRTween67.chain(UpperLegRTween78);
  UpperLegRTween78.chain(UpperLegRTween89);
  UpperLegRTween89.chain(UpperLegRTween910);
  UpperLegRTween910.chain(UpperLegRTween1011);
  UpperLegRTween1011.chain(UpperLegRTween1112);
  UpperLegRTween1112.chain(UpperLegRTween1213);
  UpperLegRTween1213.chain(UpperLegRTween1314);
  UpperLegRTween1314.chain(UpperLegRTween1415);
  UpperLegRTween1415.chain(UpperLegRTween1516);
  UpperLegRTween1516.chain(UpperLegRTween1617);
  UpperLegRTween1617.chain(UpperLegRTween01);

  UpperLegRTween01.onUpdate(updateFunc);
  UpperLegRTween12.onUpdate(updateFunc);
  UpperLegRTween23.onUpdate(updateFunc);
  UpperLegRTween34.onUpdate(updateFunc);
  UpperLegRTween45.onUpdate(updateFunc);
  UpperLegRTween56.onUpdate(updateFunc);
  UpperLegRTween67.onUpdate(updateFunc);
  UpperLegRTween78.onUpdate(updateFunc);
  UpperLegRTween89.onUpdate(updateFunc);
  UpperLegRTween910.onUpdate(updateFunc);
  UpperLegRTween1011.onUpdate(updateFunc);
  UpperLegRTween1112.onUpdate(updateFunc);
  UpperLegRTween1213.onUpdate(updateFunc);
  UpperLegRTween1314.onUpdate(updateFunc);
  UpperLegRTween1415.onUpdate(updateFunc);
  UpperLegRTween1516.onUpdate(updateFunc);
  UpperLegRTween1617.onUpdate(updateFunc);
 
  UpperLegRTween01.start();

  const LowerLegRQuad = new THREE.Quaternion().copy(LowerLegR.quaternion);

  updateFunc = (transf) => {
    LowerLegR.quaternion.multiplyQuaternions(LowerLegRQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  };

  const LowerLegRTween01 = new TWEEN.Tween({qx:runLowerLegR[0].qx, qy:runLowerLegR[0].qy, qz:runLowerLegR[0].qz, qw:runLowerLegR[0].qw}, run).to({qx:runLowerLegR[1].qx, qy:runLowerLegR[1].qy, qz:runLowerLegR[1].qz, qw:runLowerLegR[1].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegRTween12 = new TWEEN.Tween({qx:runLowerLegR[1].qx, qy:runLowerLegR[1].qy, qz:runLowerLegR[1].qz, qw:runLowerLegR[1].qw}, run).to({qx:runLowerLegR[2].qx, qy:runLowerLegR[2].qy, qz:runLowerLegR[2].qz, qw:runLowerLegR[2].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegRTween23 = new TWEEN.Tween({qx:runLowerLegR[2].qx, qy:runLowerLegR[2].qy, qz:runLowerLegR[2].qz, qw:runLowerLegR[2].qw}, run).to({qx:runLowerLegR[3].qx, qy:runLowerLegR[3].qy, qz:runLowerLegR[3].qz, qw:runLowerLegR[3].qw}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegRTween34 = new TWEEN.Tween({qx:runLowerLegR[3].qx, qy:runLowerLegR[3].qy, qz:runLowerLegR[3].qz, qw:runLowerLegR[3].qw}, run).to({qx:runLowerLegR[4].qx, qy:runLowerLegR[4].qy, qz:runLowerLegR[4].qz, qw:runLowerLegR[4].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegRTween45 = new TWEEN.Tween({qx:runLowerLegR[4].qx, qy:runLowerLegR[4].qy, qz:runLowerLegR[4].qz, qw:runLowerLegR[4].qw}, run).to({qx:runLowerLegR[5].qx, qy:runLowerLegR[5].qy, qz:runLowerLegR[5].qz, qw:runLowerLegR[5].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegRTween56 = new TWEEN.Tween({qx:runLowerLegR[5].qx, qy:runLowerLegR[5].qy, qz:runLowerLegR[5].qz, qw:runLowerLegR[5].qw}, run).to({qx:runLowerLegR[6].qx, qy:runLowerLegR[6].qy, qz:runLowerLegR[6].qz, qw:runLowerLegR[6].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegRTween67 = new TWEEN.Tween({qx:runLowerLegR[6].qx, qy:runLowerLegR[6].qy, qz:runLowerLegR[6].qz, qw:runLowerLegR[6].qw}, run).to({qx:runLowerLegR[7].qx, qy:runLowerLegR[7].qy, qz:runLowerLegR[7].qz, qw:runLowerLegR[7].qw}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegRTween78 = new TWEEN.Tween({qx:runLowerLegR[7].qx, qy:runLowerLegR[7].qy, qz:runLowerLegR[7].qz, qw:runLowerLegR[7].qw}, run).to({qx:runLowerLegR[8].qx, qy:runLowerLegR[8].qy, qz:runLowerLegR[8].qz, qw:runLowerLegR[8].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegRTween89 = new TWEEN.Tween({qx:runLowerLegR[8].qx, qy:runLowerLegR[8].qy, qz:runLowerLegR[8].qz, qw:runLowerLegR[8].qw}, run).to({qx:runLowerLegR[9].qx, qy:runLowerLegR[9].qy, qz:runLowerLegR[9].qz, qw:runLowerLegR[9].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegRTween910 = new TWEEN.Tween({qx:runLowerLegR[9].qx, qy:runLowerLegR[9].qy, qz:runLowerLegR[9].qz, qw:runLowerLegR[9].qw}, run).to({qx:runLowerLegR[10].qx, qy:runLowerLegR[10].qy, qz:runLowerLegR[10].qz, qw:runLowerLegR[10].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegRTween1011 = new TWEEN.Tween({qx:runLowerLegR[10].qx, qy:runLowerLegR[10].qy, qz:runLowerLegR[10].qz, qw:runLowerLegR[10].qw}, run).to({qx:runLowerLegR[11].qx, qy:runLowerLegR[11].qy, qz:runLowerLegR[11].qz, qw:runLowerLegR[11].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegRTween1112 = new TWEEN.Tween({qx:runLowerLegR[11].qx, qy:runLowerLegR[11].qy, qz:runLowerLegR[11].qz, qw:runLowerLegR[11].qw}, run).to({qx:runLowerLegR[12].qx, qy:runLowerLegR[12].qy, qz:runLowerLegR[12].qz, qw:runLowerLegR[12].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegRTween1213 = new TWEEN.Tween({qx:runLowerLegR[12].qx, qy:runLowerLegR[12].qy, qz:runLowerLegR[12].qz, qw:runLowerLegR[12].qw}, run).to({qx:runLowerLegR[13].qx, qy:runLowerLegR[13].qy, qz:runLowerLegR[13].qz, qw:runLowerLegR[13].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegRTween1314 = new TWEEN.Tween({qx:runLowerLegR[13].qx, qy:runLowerLegR[13].qy, qz:runLowerLegR[13].qz, qw:runLowerLegR[13].qw}, run).to({qx:runLowerLegR[14].qx, qy:runLowerLegR[14].qy, qz:runLowerLegR[14].qz, qw:runLowerLegR[14].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegRTween1415 = new TWEEN.Tween({qx:runLowerLegR[14].qx, qy:runLowerLegR[14].qy, qz:runLowerLegR[14].qz, qw:runLowerLegR[14].qw}, run).to({qx:runLowerLegR[15].qx, qy:runLowerLegR[15].qy, qz:runLowerLegR[15].qz, qw:runLowerLegR[15].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegRTween1516 = new TWEEN.Tween({qx:runLowerLegR[15].qx, qy:runLowerLegR[15].qy, qz:runLowerLegR[15].qz, qw:runLowerLegR[15].qw}, run).to({qx:runLowerLegR[16].qx, qy:runLowerLegR[16].qy, qz:runLowerLegR[16].qz, qw:runLowerLegR[16].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegRTween1617 = new TWEEN.Tween({qx:runLowerLegR[16].qx, qy:runLowerLegR[16].qy, qz:runLowerLegR[16].qz, qw:runLowerLegR[16].qw}, run).to({qx:runLowerLegR[17].qx, qy:runLowerLegR[17].qy, qz:runLowerLegR[17].qz, qw:runLowerLegR[17].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
 
  LowerLegRTween01.chain(LowerLegRTween12);
  LowerLegRTween12.chain(LowerLegRTween23);
  LowerLegRTween23.chain(LowerLegRTween34);
  LowerLegRTween34.chain(LowerLegRTween45);
  LowerLegRTween45.chain(LowerLegRTween56);
  LowerLegRTween56.chain(LowerLegRTween67);
  LowerLegRTween67.chain(LowerLegRTween78);
  LowerLegRTween78.chain(LowerLegRTween89);
  LowerLegRTween89.chain(LowerLegRTween910);
  LowerLegRTween910.chain(LowerLegRTween1011);
  LowerLegRTween1011.chain(LowerLegRTween1112);
  LowerLegRTween1112.chain(LowerLegRTween1213);
  LowerLegRTween1213.chain(LowerLegRTween1314);
  LowerLegRTween1314.chain(LowerLegRTween1415);
  LowerLegRTween1415.chain(LowerLegRTween1516);
  LowerLegRTween1516.chain(LowerLegRTween1617);
  LowerLegRTween1617.chain(LowerLegRTween01);

  LowerLegRTween01.onUpdate(updateFunc);
  LowerLegRTween12.onUpdate(updateFunc);
  LowerLegRTween23.onUpdate(updateFunc);
  LowerLegRTween34.onUpdate(updateFunc);
  LowerLegRTween45.onUpdate(updateFunc);
  LowerLegRTween56.onUpdate(updateFunc);
  LowerLegRTween67.onUpdate(updateFunc);
  LowerLegRTween78.onUpdate(updateFunc);
  LowerLegRTween89.onUpdate(updateFunc);
  LowerLegRTween910.onUpdate(updateFunc);
  LowerLegRTween1011.onUpdate(updateFunc);
  LowerLegRTween1112.onUpdate(updateFunc);
  LowerLegRTween1213.onUpdate(updateFunc);
  LowerLegRTween1314.onUpdate(updateFunc);
  LowerLegRTween1415.onUpdate(updateFunc);
  LowerLegRTween1516.onUpdate(updateFunc);
  LowerLegRTween1617.onUpdate(updateFunc);

  LowerLegRTween01.start();


  const UpperArmLQuad = new THREE.Quaternion().copy(UpperArmL.quaternion);
  
  updateFunc = (transf) => {
    UpperArmL.quaternion.multiplyQuaternions(UpperArmLQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  };

  const UpperArmLTween01 = new TWEEN.Tween({qx:runUpperArmL[0].qx, qy:runUpperArmL[0].qy, qz:runUpperArmL[0].qz, qw:runUpperArmL[0].qw}, run).to({qx:runUpperArmL[1].qx, qy:runUpperArmL[1].qy, qz:runUpperArmL[1].qz, qw:runUpperArmL[1].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmLTween12 = new TWEEN.Tween({qx:runUpperArmL[1].qx, qy:runUpperArmL[1].qy, qz:runUpperArmL[1].qz, qw:runUpperArmL[1].qw}, run).to({qx:runUpperArmL[2].qx, qy:runUpperArmL[2].qy, qz:runUpperArmL[2].qz, qw:runUpperArmL[2].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmLTween23 = new TWEEN.Tween({qx:runUpperArmL[2].qx, qy:runUpperArmL[2].qy, qz:runUpperArmL[2].qz, qw:runUpperArmL[2].qw}, run).to({qx:runUpperArmL[3].qx, qy:runUpperArmL[3].qy, qz:runUpperArmL[3].qz, qw:runUpperArmL[3].qw}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmLTween34 = new TWEEN.Tween({qx:runUpperArmL[3].qx, qy:runUpperArmL[3].qy, qz:runUpperArmL[3].qz, qw:runUpperArmL[3].qw}, run).to({qx:runUpperArmL[4].qx, qy:runUpperArmL[4].qy, qz:runUpperArmL[4].qz, qw:runUpperArmL[4].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmLTween45 = new TWEEN.Tween({qx:runUpperArmL[4].qx, qy:runUpperArmL[4].qy, qz:runUpperArmL[4].qz, qw:runUpperArmL[4].qw}, run).to({qx:runUpperArmL[5].qx, qy:runUpperArmL[5].qy, qz:runUpperArmL[5].qz, qw:runUpperArmL[5].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmLTween56 = new TWEEN.Tween({qx:runUpperArmL[5].qx, qy:runUpperArmL[5].qy, qz:runUpperArmL[5].qz, qw:runUpperArmL[5].qw}, run).to({qx:runUpperArmL[6].qx, qy:runUpperArmL[6].qy, qz:runUpperArmL[6].qz, qw:runUpperArmL[6].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmLTween67 = new TWEEN.Tween({qx:runUpperArmL[6].qx, qy:runUpperArmL[6].qy, qz:runUpperArmL[6].qz, qw:runUpperArmL[6].qw}, run).to({qx:runUpperArmL[7].qx, qy:runUpperArmL[7].qy, qz:runUpperArmL[7].qz, qw:runUpperArmL[7].qw}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmLTween78 = new TWEEN.Tween({qx:runUpperArmL[7].qx, qy:runUpperArmL[7].qy, qz:runUpperArmL[7].qz, qw:runUpperArmL[7].qw}, run).to({qx:runUpperArmL[8].qx, qy:runUpperArmL[8].qy, qz:runUpperArmL[8].qz, qw:runUpperArmL[8].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmLTween89 = new TWEEN.Tween({qx:runUpperArmL[8].qx, qy:runUpperArmL[8].qy, qz:runUpperArmL[8].qz, qw:runUpperArmL[8].qw}, run).to({qx:runUpperArmL[9].qx, qy:runUpperArmL[9].qy, qz:runUpperArmL[9].qz, qw:runUpperArmL[9].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmLTween910 = new TWEEN.Tween({qx:runUpperArmL[9].qx, qy:runUpperArmL[9].qy, qz:runUpperArmL[9].qz, qw:runUpperArmL[9].qw}, run).to({qx:runUpperArmL[10].qx, qy:runUpperArmL[10].qy, qz:runUpperArmL[10].qz, qw:runUpperArmL[10].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmLTween1011 = new TWEEN.Tween({qx:runUpperArmL[10].qx, qy:runUpperArmL[10].qy, qz:runUpperArmL[10].qz, qw:runUpperArmL[10].qw}, run).to({qx:runUpperArmL[11].qx, qy:runUpperArmL[11].qy, qz:runUpperArmL[11].qz, qw:runUpperArmL[11].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmLTween1112 = new TWEEN.Tween({qx:runUpperArmL[11].qx, qy:runUpperArmL[11].qy, qz:runUpperArmL[11].qz, qw:runUpperArmL[11].qw}, run).to({qx:runUpperArmL[12].qx, qy:runUpperArmL[12].qy, qz:runUpperArmL[12].qz, qw:runUpperArmL[12].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmLTween1213 = new TWEEN.Tween({qx:runUpperArmL[12].qx, qy:runUpperArmL[12].qy, qz:runUpperArmL[12].qz, qw:runUpperArmL[12].qw}, run).to({qx:runUpperArmL[13].qx, qy:runUpperArmL[13].qy, qz:runUpperArmL[13].qz, qw:runUpperArmL[13].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmLTween1314 = new TWEEN.Tween({qx:runUpperArmL[13].qx, qy:runUpperArmL[13].qy, qz:runUpperArmL[13].qz, qw:runUpperArmL[13].qw}, run).to({qx:runUpperArmL[14].qx, qy:runUpperArmL[14].qy, qz:runUpperArmL[14].qz, qw:runUpperArmL[14].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmLTween1415 = new TWEEN.Tween({qx:runUpperArmL[14].qx, qy:runUpperArmL[14].qy, qz:runUpperArmL[14].qz, qw:runUpperArmL[14].qw}, run).to({qx:runUpperArmL[15].qx, qy:runUpperArmL[15].qy, qz:runUpperArmL[15].qz, qw:runUpperArmL[15].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmLTween1516 = new TWEEN.Tween({qx:runUpperArmL[15].qx, qy:runUpperArmL[15].qy, qz:runUpperArmL[15].qz, qw:runUpperArmL[15].qw}, run).to({qx:runUpperArmL[16].qx, qy:runUpperArmL[16].qy, qz:runUpperArmL[16].qz, qw:runUpperArmL[16].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmLTween1617 = new TWEEN.Tween({qx:runUpperArmL[16].qx, qy:runUpperArmL[16].qy, qz:runUpperArmL[16].qz, qw:runUpperArmL[16].qw}, run).to({qx:runUpperArmL[17].qx, qy:runUpperArmL[17].qy, qz:runUpperArmL[17].qz, qw:runUpperArmL[17].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
 
  UpperArmLTween01.chain(UpperArmLTween12);
  UpperArmLTween12.chain(UpperArmLTween23);
  UpperArmLTween23.chain(UpperArmLTween34);
  UpperArmLTween34.chain(UpperArmLTween45);
  UpperArmLTween45.chain(UpperArmLTween56);
  UpperArmLTween56.chain(UpperArmLTween67);
  UpperArmLTween67.chain(UpperArmLTween78);
  UpperArmLTween78.chain(UpperArmLTween89);
  UpperArmLTween89.chain(UpperArmLTween910);
  UpperArmLTween910.chain(UpperArmLTween1011);
  UpperArmLTween1011.chain(UpperArmLTween1112);
  UpperArmLTween1112.chain(UpperArmLTween1213);
  UpperArmLTween1213.chain(UpperArmLTween1314);
  UpperArmLTween1314.chain(UpperArmLTween1415);
  UpperArmLTween1415.chain(UpperArmLTween1516);
  UpperArmLTween1516.chain(UpperArmLTween1617);
  UpperArmLTween1617.chain(UpperArmLTween01);

  UpperArmLTween01.onUpdate(updateFunc);
  UpperArmLTween12.onUpdate(updateFunc);
  UpperArmLTween23.onUpdate(updateFunc);
  UpperArmLTween34.onUpdate(updateFunc);
  UpperArmLTween45.onUpdate(updateFunc);
  UpperArmLTween56.onUpdate(updateFunc);
  UpperArmLTween67.onUpdate(updateFunc);
  UpperArmLTween78.onUpdate(updateFunc);
  UpperArmLTween89.onUpdate(updateFunc);
  UpperArmLTween910.onUpdate(updateFunc);
  UpperArmLTween1011.onUpdate(updateFunc);
  UpperArmLTween1112.onUpdate(updateFunc);
  UpperArmLTween1213.onUpdate(updateFunc);
  UpperArmLTween1314.onUpdate(updateFunc);
  UpperArmLTween1415.onUpdate(updateFunc);
  UpperArmLTween1516.onUpdate(updateFunc);
  UpperArmLTween1617.onUpdate(updateFunc);

  UpperArmLTween01.start();

  const LowerArmLQuad = new THREE.Quaternion().copy(LowerArmL.quaternion);
  
  updateFunc = (transf) => {
    LowerArmL.quaternion.multiplyQuaternions(LowerArmLQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  };

  const LowerArmLTween01 = new TWEEN.Tween({qx:runLowerArmL[0].qx, qy:runLowerArmL[0].qy, qz:runLowerArmL[0].qz, qw:runLowerArmL[0].qw}, run).to({qx:runLowerArmL[1].qx, qy:runLowerArmL[1].qy, qz:runLowerArmL[1].qz, qw:runLowerArmL[1].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmLTween12 = new TWEEN.Tween({qx:runLowerArmL[1].qx, qy:runLowerArmL[1].qy, qz:runLowerArmL[1].qz, qw:runLowerArmL[1].qw}, run).to({qx:runLowerArmL[2].qx, qy:runLowerArmL[2].qy, qz:runLowerArmL[2].qz, qw:runLowerArmL[2].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmLTween23 = new TWEEN.Tween({qx:runLowerArmL[2].qx, qy:runLowerArmL[2].qy, qz:runLowerArmL[2].qz, qw:runLowerArmL[2].qw}, run).to({qx:runLowerArmL[3].qx, qy:runLowerArmL[3].qy, qz:runLowerArmL[3].qz, qw:runLowerArmL[3].qw}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmLTween34 = new TWEEN.Tween({qx:runLowerArmL[3].qx, qy:runLowerArmL[3].qy, qz:runLowerArmL[3].qz, qw:runLowerArmL[3].qw}, run).to({qx:runLowerArmL[4].qx, qy:runLowerArmL[4].qy, qz:runLowerArmL[4].qz, qw:runLowerArmL[4].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmLTween45 = new TWEEN.Tween({qx:runLowerArmL[4].qx, qy:runLowerArmL[4].qy, qz:runLowerArmL[4].qz, qw:runLowerArmL[4].qw}, run).to({qx:runLowerArmL[5].qx, qy:runLowerArmL[5].qy, qz:runLowerArmL[5].qz, qw:runLowerArmL[5].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmLTween56 = new TWEEN.Tween({qx:runLowerArmL[5].qx, qy:runLowerArmL[5].qy, qz:runLowerArmL[5].qz, qw:runLowerArmL[5].qw}, run).to({qx:runLowerArmL[6].qx, qy:runLowerArmL[6].qy, qz:runLowerArmL[6].qz, qw:runLowerArmL[6].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmLTween67 = new TWEEN.Tween({qx:runLowerArmL[6].qx, qy:runLowerArmL[6].qy, qz:runLowerArmL[6].qz, qw:runLowerArmL[6].qw}, run).to({qx:runLowerArmL[7].qx, qy:runLowerArmL[7].qy, qz:runLowerArmL[7].qz, qw:runLowerArmL[7].qw}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmLTween78 = new TWEEN.Tween({qx:runLowerArmL[7].qx, qy:runLowerArmL[7].qy, qz:runLowerArmL[7].qz, qw:runLowerArmL[7].qw}, run).to({qx:runLowerArmL[8].qx, qy:runLowerArmL[8].qy, qz:runLowerArmL[8].qz, qw:runLowerArmL[8].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmLTween89 = new TWEEN.Tween({qx:runLowerArmL[8].qx, qy:runLowerArmL[8].qy, qz:runLowerArmL[8].qz, qw:runLowerArmL[8].qw}, run).to({qx:runLowerArmL[9].qx, qy:runLowerArmL[9].qy, qz:runLowerArmL[9].qz, qw:runLowerArmL[9].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmLTween910 = new TWEEN.Tween({qx:runLowerArmL[9].qx, qy:runLowerArmL[9].qy, qz:runLowerArmL[9].qz, qw:runLowerArmL[9].qw}, run).to({qx:runLowerArmL[10].qx, qy:runLowerArmL[10].qy, qz:runLowerArmL[10].qz, qw:runLowerArmL[10].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmLTween1011 = new TWEEN.Tween({qx:runLowerArmL[10].qx, qy:runLowerArmL[10].qy, qz:runLowerArmL[10].qz, qw:runLowerArmL[10].qw}, run).to({qx:runLowerArmL[11].qx, qy:runLowerArmL[11].qy, qz:runLowerArmL[11].qz, qw:runLowerArmL[11].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmLTween1112 = new TWEEN.Tween({qx:runLowerArmL[11].qx, qy:runLowerArmL[11].qy, qz:runLowerArmL[11].qz, qw:runLowerArmL[11].qw}, run).to({qx:runLowerArmL[12].qx, qy:runLowerArmL[12].qy, qz:runLowerArmL[12].qz, qw:runLowerArmL[12].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmLTween1213 = new TWEEN.Tween({qx:runLowerArmL[12].qx, qy:runLowerArmL[12].qy, qz:runLowerArmL[12].qz, qw:runLowerArmL[12].qw}, run).to({qx:runLowerArmL[13].qx, qy:runLowerArmL[13].qy, qz:runLowerArmL[13].qz, qw:runLowerArmL[13].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmLTween1314 = new TWEEN.Tween({qx:runLowerArmL[13].qx, qy:runLowerArmL[13].qy, qz:runLowerArmL[13].qz, qw:runLowerArmL[13].qw}, run).to({qx:runLowerArmL[14].qx, qy:runLowerArmL[14].qy, qz:runLowerArmL[14].qz, qw:runLowerArmL[14].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmLTween1415 = new TWEEN.Tween({qx:runLowerArmL[14].qx, qy:runLowerArmL[14].qy, qz:runLowerArmL[14].qz, qw:runLowerArmL[14].qw}, run).to({qx:runLowerArmL[15].qx, qy:runLowerArmL[15].qy, qz:runLowerArmL[15].qz, qw:runLowerArmL[15].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmLTween1516 = new TWEEN.Tween({qx:runLowerArmL[15].qx, qy:runLowerArmL[15].qy, qz:runLowerArmL[15].qz, qw:runLowerArmL[15].qw}, run).to({qx:runLowerArmL[16].qx, qy:runLowerArmL[16].qy, qz:runLowerArmL[16].qz, qw:runLowerArmL[16].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmLTween1617 = new TWEEN.Tween({qx:runLowerArmL[16].qx, qy:runLowerArmL[16].qy, qz:runLowerArmL[16].qz, qw:runLowerArmL[16].qw}, run).to({qx:runLowerArmL[17].qx, qy:runLowerArmL[17].qy, qz:runLowerArmL[17].qz, qw:runLowerArmL[17].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
 
  LowerArmLTween01.chain(LowerArmLTween12);
  LowerArmLTween12.chain(LowerArmLTween23);
  LowerArmLTween23.chain(LowerArmLTween34);
  LowerArmLTween34.chain(LowerArmLTween45);
  LowerArmLTween45.chain(LowerArmLTween56);
  LowerArmLTween56.chain(LowerArmLTween67);
  LowerArmLTween67.chain(LowerArmLTween78);
  LowerArmLTween78.chain(LowerArmLTween89);
  LowerArmLTween89.chain(LowerArmLTween910);
  LowerArmLTween910.chain(LowerArmLTween1011);
  LowerArmLTween1011.chain(LowerArmLTween1112);
  LowerArmLTween1112.chain(LowerArmLTween1213);
  LowerArmLTween1213.chain(LowerArmLTween1314);
  LowerArmLTween1314.chain(LowerArmLTween1415);
  LowerArmLTween1415.chain(LowerArmLTween1516);
  LowerArmLTween1516.chain(LowerArmLTween1617);
  LowerArmLTween1617.chain(LowerArmLTween01);

  LowerArmLTween01.onUpdate(updateFunc);
  LowerArmLTween12.onUpdate(updateFunc);
  LowerArmLTween23.onUpdate(updateFunc);
  LowerArmLTween34.onUpdate(updateFunc);
  LowerArmLTween45.onUpdate(updateFunc);
  LowerArmLTween56.onUpdate(updateFunc);
  LowerArmLTween67.onUpdate(updateFunc);
  LowerArmLTween78.onUpdate(updateFunc);
  LowerArmLTween89.onUpdate(updateFunc);
  LowerArmLTween910.onUpdate(updateFunc);
  LowerArmLTween1011.onUpdate(updateFunc);
  LowerArmLTween1112.onUpdate(updateFunc);
  LowerArmLTween1213.onUpdate(updateFunc);
  LowerArmLTween1314.onUpdate(updateFunc);
  LowerArmLTween1415.onUpdate(updateFunc);
  LowerArmLTween1516.onUpdate(updateFunc);
  LowerArmLTween1617.onUpdate(updateFunc);

  LowerArmLTween01.start();

  const UpperArmRQuad = new THREE.Quaternion().copy(UpperArmR.quaternion);
  
  updateFunc = (transf) => {
    UpperArmR.quaternion.multiplyQuaternions(UpperArmRQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  };

  const UpperArmRTween01 = new TWEEN.Tween({qx:runUpperArmR[0].qx, qy:runUpperArmR[0].qy, qz:runUpperArmR[0].qz, qw:runUpperArmR[0].qw}, run).to({qx:runUpperArmR[1].qx, qy:runUpperArmR[1].qy, qz:runUpperArmR[1].qz, qw:runUpperArmR[1].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmRTween12 = new TWEEN.Tween({qx:runUpperArmR[1].qx, qy:runUpperArmR[1].qy, qz:runUpperArmR[1].qz, qw:runUpperArmR[1].qw}, run).to({qx:runUpperArmR[2].qx, qy:runUpperArmR[2].qy, qz:runUpperArmR[2].qz, qw:runUpperArmR[2].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmRTween23 = new TWEEN.Tween({qx:runUpperArmR[2].qx, qy:runUpperArmR[2].qy, qz:runUpperArmR[2].qz, qw:runUpperArmR[2].qw}, run).to({qx:runUpperArmR[3].qx, qy:runUpperArmR[3].qy, qz:runUpperArmR[3].qz, qw:runUpperArmR[3].qw}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmRTween34 = new TWEEN.Tween({qx:runUpperArmR[3].qx, qy:runUpperArmR[3].qy, qz:runUpperArmR[3].qz, qw:runUpperArmR[3].qw}, run).to({qx:runUpperArmR[4].qx, qy:runUpperArmR[4].qy, qz:runUpperArmR[4].qz, qw:runUpperArmR[4].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmRTween45 = new TWEEN.Tween({qx:runUpperArmR[4].qx, qy:runUpperArmR[4].qy, qz:runUpperArmR[4].qz, qw:runUpperArmR[4].qw}, run).to({qx:runUpperArmR[5].qx, qy:runUpperArmR[5].qy, qz:runUpperArmR[5].qz, qw:runUpperArmR[5].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmRTween56 = new TWEEN.Tween({qx:runUpperArmR[5].qx, qy:runUpperArmR[5].qy, qz:runUpperArmR[5].qz, qw:runUpperArmR[5].qw}, run).to({qx:runUpperArmR[6].qx, qy:runUpperArmR[6].qy, qz:runUpperArmR[6].qz, qw:runUpperArmR[6].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmRTween67 = new TWEEN.Tween({qx:runUpperArmR[6].qx, qy:runUpperArmR[6].qy, qz:runUpperArmR[6].qz, qw:runUpperArmR[6].qw}, run).to({qx:runUpperArmR[7].qx, qy:runUpperArmR[7].qy, qz:runUpperArmR[7].qz, qw:runUpperArmR[7].qw}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmRTween78 = new TWEEN.Tween({qx:runUpperArmR[7].qx, qy:runUpperArmR[7].qy, qz:runUpperArmR[7].qz, qw:runUpperArmR[7].qw}, run).to({qx:runUpperArmR[8].qx, qy:runUpperArmR[8].qy, qz:runUpperArmR[8].qz, qw:runUpperArmR[8].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmRTween89 = new TWEEN.Tween({qx:runUpperArmR[8].qx, qy:runUpperArmR[8].qy, qz:runUpperArmR[8].qz, qw:runUpperArmR[8].qw}, run).to({qx:runUpperArmR[9].qx, qy:runUpperArmR[9].qy, qz:runUpperArmR[9].qz, qw:runUpperArmR[9].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmRTween910 = new TWEEN.Tween({qx:runUpperArmR[9].qx, qy:runUpperArmR[9].qy, qz:runUpperArmR[9].qz, qw:runUpperArmR[9].qw}, run).to({qx:runUpperArmR[10].qx, qy:runUpperArmR[10].qy, qz:runUpperArmR[10].qz, qw:runUpperArmR[10].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmRTween1011 = new TWEEN.Tween({qx:runUpperArmR[10].qx, qy:runUpperArmR[10].qy, qz:runUpperArmR[10].qz, qw:runUpperArmR[10].qw}, run).to({qx:runUpperArmR[11].qx, qy:runUpperArmR[11].qy, qz:runUpperArmR[11].qz, qw:runUpperArmR[11].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmRTween1112 = new TWEEN.Tween({qx:runUpperArmR[11].qx, qy:runUpperArmR[11].qy, qz:runUpperArmR[11].qz, qw:runUpperArmR[11].qw}, run).to({qx:runUpperArmR[12].qx, qy:runUpperArmR[12].qy, qz:runUpperArmR[12].qz, qw:runUpperArmR[12].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmRTween1213 = new TWEEN.Tween({qx:runUpperArmR[12].qx, qy:runUpperArmR[12].qy, qz:runUpperArmR[12].qz, qw:runUpperArmR[12].qw}, run).to({qx:runUpperArmR[13].qx, qy:runUpperArmR[13].qy, qz:runUpperArmR[13].qz, qw:runUpperArmR[13].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmRTween1314 = new TWEEN.Tween({qx:runUpperArmR[13].qx, qy:runUpperArmR[13].qy, qz:runUpperArmR[13].qz, qw:runUpperArmR[13].qw}, run).to({qx:runUpperArmR[14].qx, qy:runUpperArmR[14].qy, qz:runUpperArmR[14].qz, qw:runUpperArmR[14].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmRTween1415 = new TWEEN.Tween({qx:runUpperArmR[14].qx, qy:runUpperArmR[14].qy, qz:runUpperArmR[14].qz, qw:runUpperArmR[14].qw}, run).to({qx:runUpperArmR[15].qx, qy:runUpperArmR[15].qy, qz:runUpperArmR[15].qz, qw:runUpperArmR[15].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmRTween1516 = new TWEEN.Tween({qx:runUpperArmR[15].qx, qy:runUpperArmR[15].qy, qz:runUpperArmR[15].qz, qw:runUpperArmR[15].qw}, run).to({qx:runUpperArmR[16].qx, qy:runUpperArmR[16].qy, qz:runUpperArmR[16].qz, qw:runUpperArmR[16].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmRTween1617 = new TWEEN.Tween({qx:runUpperArmR[16].qx, qy:runUpperArmR[16].qy, qz:runUpperArmR[16].qz, qw:runUpperArmR[16].qw}, run).to({qx:runUpperArmR[17].qx, qy:runUpperArmR[17].qy, qz:runUpperArmR[17].qz, qw:runUpperArmR[17].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
 
  UpperArmRTween01.chain(UpperArmRTween12);
  UpperArmRTween12.chain(UpperArmRTween23);
  UpperArmRTween23.chain(UpperArmRTween34);
  UpperArmRTween34.chain(UpperArmRTween45);
  UpperArmRTween45.chain(UpperArmRTween56);
  UpperArmRTween56.chain(UpperArmRTween67);
  UpperArmRTween67.chain(UpperArmRTween78);
  UpperArmRTween78.chain(UpperArmRTween89);
  UpperArmRTween89.chain(UpperArmRTween910);
  UpperArmRTween910.chain(UpperArmRTween1011);
  UpperArmRTween1011.chain(UpperArmRTween1112);
  UpperArmRTween1112.chain(UpperArmRTween1213);
  UpperArmRTween1213.chain(UpperArmRTween1314);
  UpperArmRTween1314.chain(UpperArmRTween1415);
  UpperArmRTween1415.chain(UpperArmRTween1516);
  UpperArmRTween1516.chain(UpperArmRTween1617);
  UpperArmRTween1617.chain(UpperArmRTween01);

  UpperArmRTween01.onUpdate(updateFunc);
  UpperArmRTween12.onUpdate(updateFunc);
  UpperArmRTween23.onUpdate(updateFunc);
  UpperArmRTween34.onUpdate(updateFunc);
  UpperArmRTween45.onUpdate(updateFunc);
  UpperArmRTween56.onUpdate(updateFunc);
  UpperArmRTween67.onUpdate(updateFunc);
  UpperArmRTween78.onUpdate(updateFunc);
  UpperArmRTween89.onUpdate(updateFunc);
  UpperArmRTween910.onUpdate(updateFunc);
  UpperArmRTween1011.onUpdate(updateFunc);
  UpperArmRTween1112.onUpdate(updateFunc);
  UpperArmRTween1213.onUpdate(updateFunc);
  UpperArmRTween1314.onUpdate(updateFunc);
  UpperArmRTween1415.onUpdate(updateFunc);
  UpperArmRTween1516.onUpdate(updateFunc);
  UpperArmRTween1617.onUpdate(updateFunc);

  UpperArmRTween01.start();

  const LowerArmRQuad = new THREE.Quaternion().copy(LowerArmR.quaternion);
  
  updateFunc = (transf) => {
    LowerArmR.quaternion.multiplyQuaternions(LowerArmRQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  };

  const LowerArmRTween01 = new TWEEN.Tween({qx:runLowerArmR[0].qx, qy:runLowerArmR[0].qy, qz:runLowerArmR[0].qz, qw:runLowerArmR[0].qw}, run).to({qx:runLowerArmR[1].qx, qy:runLowerArmR[1].qy, qz:runLowerArmR[1].qz, qw:runLowerArmR[1].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmRTween12 = new TWEEN.Tween({qx:runLowerArmR[1].qx, qy:runLowerArmR[1].qy, qz:runLowerArmR[1].qz, qw:runLowerArmR[1].qw}, run).to({qx:runLowerArmR[2].qx, qy:runLowerArmR[2].qy, qz:runLowerArmR[2].qz, qw:runLowerArmR[2].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmRTween23 = new TWEEN.Tween({qx:runLowerArmR[2].qx, qy:runLowerArmR[2].qy, qz:runLowerArmR[2].qz, qw:runLowerArmR[2].qw}, run).to({qx:runLowerArmR[3].qx, qy:runLowerArmR[3].qy, qz:runLowerArmR[3].qz, qw:runLowerArmR[3].qw}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmRTween34 = new TWEEN.Tween({qx:runLowerArmR[3].qx, qy:runLowerArmR[3].qy, qz:runLowerArmR[3].qz, qw:runLowerArmR[3].qw}, run).to({qx:runLowerArmR[4].qx, qy:runLowerArmR[4].qy, qz:runLowerArmR[4].qz, qw:runLowerArmR[4].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmRTween45 = new TWEEN.Tween({qx:runLowerArmR[4].qx, qy:runLowerArmR[4].qy, qz:runLowerArmR[4].qz, qw:runLowerArmR[4].qw}, run).to({qx:runLowerArmR[5].qx, qy:runLowerArmR[5].qy, qz:runLowerArmR[5].qz, qw:runLowerArmR[5].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmRTween56 = new TWEEN.Tween({qx:runLowerArmR[5].qx, qy:runLowerArmR[5].qy, qz:runLowerArmR[5].qz, qw:runLowerArmR[5].qw}, run).to({qx:runLowerArmR[6].qx, qy:runLowerArmR[6].qy, qz:runLowerArmR[6].qz, qw:runLowerArmR[6].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmRTween67 = new TWEEN.Tween({qx:runLowerArmR[6].qx, qy:runLowerArmR[6].qy, qz:runLowerArmR[6].qz, qw:runLowerArmR[6].qw}, run).to({qx:runLowerArmR[7].qx, qy:runLowerArmR[7].qy, qz:runLowerArmR[7].qz, qw:runLowerArmR[7].qw}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmRTween78 = new TWEEN.Tween({qx:runLowerArmR[7].qx, qy:runLowerArmR[7].qy, qz:runLowerArmR[7].qz, qw:runLowerArmR[7].qw}, run).to({qx:runLowerArmR[8].qx, qy:runLowerArmR[8].qy, qz:runLowerArmR[8].qz, qw:runLowerArmR[8].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmRTween89 = new TWEEN.Tween({qx:runLowerArmR[8].qx, qy:runLowerArmR[8].qy, qz:runLowerArmR[8].qz, qw:runLowerArmR[8].qw}, run).to({qx:runLowerArmR[9].qx, qy:runLowerArmR[9].qy, qz:runLowerArmR[9].qz, qw:runLowerArmR[9].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmRTween910 = new TWEEN.Tween({qx:runLowerArmR[9].qx, qy:runLowerArmR[9].qy, qz:runLowerArmR[9].qz, qw:runLowerArmR[9].qw}, run).to({qx:runLowerArmR[10].qx, qy:runLowerArmR[10].qy, qz:runLowerArmR[10].qz, qw:runLowerArmR[10].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmRTween1011 = new TWEEN.Tween({qx:runLowerArmR[10].qx, qy:runLowerArmR[10].qy, qz:runLowerArmR[10].qz, qw:runLowerArmR[10].qw}, run).to({qx:runLowerArmR[11].qx, qy:runLowerArmR[11].qy, qz:runLowerArmR[11].qz, qw:runLowerArmR[11].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmRTween1112 = new TWEEN.Tween({qx:runLowerArmR[11].qx, qy:runLowerArmR[11].qy, qz:runLowerArmR[11].qz, qw:runLowerArmR[11].qw}, run).to({qx:runLowerArmR[12].qx, qy:runLowerArmR[12].qy, qz:runLowerArmR[12].qz, qw:runLowerArmR[12].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmRTween1213 = new TWEEN.Tween({qx:runLowerArmR[12].qx, qy:runLowerArmR[12].qy, qz:runLowerArmR[12].qz, qw:runLowerArmR[12].qw}, run).to({qx:runLowerArmR[13].qx, qy:runLowerArmR[13].qy, qz:runLowerArmR[13].qz, qw:runLowerArmR[13].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmRTween1314 = new TWEEN.Tween({qx:runLowerArmR[13].qx, qy:runLowerArmR[13].qy, qz:runLowerArmR[13].qz, qw:runLowerArmR[13].qw}, run).to({qx:runLowerArmR[14].qx, qy:runLowerArmR[14].qy, qz:runLowerArmR[14].qz, qw:runLowerArmR[14].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmRTween1415 = new TWEEN.Tween({qx:runLowerArmR[14].qx, qy:runLowerArmR[14].qy, qz:runLowerArmR[14].qz, qw:runLowerArmR[14].qw}, run).to({qx:runLowerArmR[15].qx, qy:runLowerArmR[15].qy, qz:runLowerArmR[15].qz, qw:runLowerArmR[15].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmRTween1516 = new TWEEN.Tween({qx:runLowerArmR[15].qx, qy:runLowerArmR[15].qy, qz:runLowerArmR[15].qz, qw:runLowerArmR[15].qw}, run).to({qx:runLowerArmR[16].qx, qy:runLowerArmR[16].qy, qz:runLowerArmR[16].qz, qw:runLowerArmR[16].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmRTween1617 = new TWEEN.Tween({qx:runLowerArmR[16].qx, qy:runLowerArmR[16].qy, qz:runLowerArmR[16].qz, qw:runLowerArmR[16].qw}, run).to({qx:runLowerArmR[17].qx, qy:runLowerArmR[17].qy, qz:runLowerArmR[17].qz, qw:runLowerArmR[17].qw}, 50).easing(TWEEN.Easing.Exponential.InOut);
 
  LowerArmRTween01.chain(LowerArmRTween12);
  LowerArmRTween12.chain(LowerArmRTween23);
  LowerArmRTween23.chain(LowerArmRTween34);
  LowerArmRTween34.chain(LowerArmRTween45);
  LowerArmRTween45.chain(LowerArmRTween56);
  LowerArmRTween56.chain(LowerArmRTween67);
  LowerArmRTween67.chain(LowerArmRTween78);
  LowerArmRTween78.chain(LowerArmRTween89);
  LowerArmRTween89.chain(LowerArmRTween910);
  LowerArmRTween910.chain(LowerArmRTween1011);
  LowerArmRTween1011.chain(LowerArmRTween1112);
  LowerArmRTween1112.chain(LowerArmRTween1213);
  LowerArmRTween1213.chain(LowerArmRTween1314);
  LowerArmRTween1314.chain(LowerArmRTween1415);
  LowerArmRTween1415.chain(LowerArmRTween1516);
  LowerArmRTween1516.chain(LowerArmRTween1617);
  LowerArmRTween1617.chain(LowerArmRTween01);

  LowerArmRTween01.onUpdate(updateFunc);
  LowerArmRTween12.onUpdate(updateFunc);
  LowerArmRTween23.onUpdate(updateFunc);
  LowerArmRTween34.onUpdate(updateFunc);
  LowerArmRTween45.onUpdate(updateFunc);
  LowerArmRTween56.onUpdate(updateFunc);
  LowerArmRTween67.onUpdate(updateFunc);
  LowerArmRTween78.onUpdate(updateFunc);
  LowerArmRTween89.onUpdate(updateFunc);
  LowerArmRTween910.onUpdate(updateFunc);
  LowerArmRTween1011.onUpdate(updateFunc);
  LowerArmRTween1112.onUpdate(updateFunc);
  LowerArmRTween1213.onUpdate(updateFunc);
  LowerArmRTween1314.onUpdate(updateFunc);
  LowerArmRTween1415.onUpdate(updateFunc);
  LowerArmRTween1516.onUpdate(updateFunc);
  LowerArmRTween1617.onUpdate(updateFunc);

  LowerArmRTween01.start();



  const TorsoQuad = new THREE.Quaternion().copy(Torso.quaternion);
  
  updateFunc = (transf) => {
    Torso.quaternion.multiplyQuaternions(TorsoQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  };

  const TorsoTween01 = new TWEEN.Tween({qx:runTorso[0].qx, qy:runTorso[0].qy, qz:runTorso[0].qz, qw:runTorso[0].qw}, run).to({qx:runTorso[1].qx, qy:runTorso[1].qy, qz:runTorso[1].qz, qw:runTorso[1].qw}, 500).easing(TWEEN.Easing.Exponential.InOut);
  const TorsoTween12 = new TWEEN.Tween({qx:runTorso[1].qx, qy:runTorso[1].qy, qz:runTorso[1].qz, qw:runTorso[1].qw}, run).to({qx:runTorso[2].qx, qy:runTorso[2].qy, qz:runTorso[2].qz, qw:runTorso[2].qw}, 550).easing(TWEEN.Easing.Exponential.InOut);

  TorsoTween01.chain(TorsoTween12);
  TorsoTween12.chain(TorsoTween01);

  TorsoTween01.onUpdate(updateFunc);
  TorsoTween12.onUpdate(updateFunc);

  TorsoTween01.start();


  const AbdomenQuad = new THREE.Quaternion().copy(Abdomen.quaternion);

  updateFunc = (transf) => {
    Abdomen.quaternion.multiplyQuaternions(AbdomenQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  };

  const AbdomenTween01 = new TWEEN.Tween({qx:runAbdomen[0].qx, qy:runAbdomen[0].qy, qz:runAbdomen[0].qz, qw:runAbdomen[0].qw}, run).to({qx:runAbdomen[1].qx, qy:runAbdomen[1].qy, qz:runAbdomen[1].qz, qw:runAbdomen[1].qw}, 200).easing(TWEEN.Easing.Exponential.InOut);
  const AbdomenTween12 = new TWEEN.Tween({qx:runAbdomen[1].qx, qy:runAbdomen[1].qy, qz:runAbdomen[1].qz, qw:runAbdomen[1].qw}, run).to({qx:runAbdomen[2].qx, qy:runAbdomen[2].qy, qz:runAbdomen[2].qz, qw:runAbdomen[2].qw}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const AbdomenTween23 = new TWEEN.Tween({qx:runAbdomen[2].qx, qy:runAbdomen[2].qy, qz:runAbdomen[2].qz, qw:runAbdomen[2].qw}, run).to({qx:runAbdomen[3].qx, qy:runAbdomen[3].qy, qz:runAbdomen[3].qz, qw:runAbdomen[3].qw}, 200).easing(TWEEN.Easing.Exponential.InOut);
  const AbdomenTween34 = new TWEEN.Tween({qx:runAbdomen[3].qx, qy:runAbdomen[3].qy, qz:runAbdomen[3].qz, qw:runAbdomen[3].qw}, run).to({qx:runAbdomen[4].qx, qy:runAbdomen[4].qy, qz:runAbdomen[4].qz, qw:runAbdomen[4].qw}, 250).easing(TWEEN.Easing.Exponential.InOut);
  const AbdomenTween45 = new TWEEN.Tween({qx:runAbdomen[4].qx, qy:runAbdomen[4].qy, qz:runAbdomen[4].qz, qw:runAbdomen[4].qw}, run).to({qx:runAbdomen[5].qx, qy:runAbdomen[5].qy, qz:runAbdomen[5].qz, qw:runAbdomen[5].qw}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const AbdomenTween56 = new TWEEN.Tween({qx:runAbdomen[5].qx, qy:runAbdomen[5].qy, qz:runAbdomen[5].qz, qw:runAbdomen[5].qw}, run).to({qx:runAbdomen[6].qx, qy:runAbdomen[6].qy, qz:runAbdomen[6].qz, qw:runAbdomen[6].qw}, 200).easing(TWEEN.Easing.Exponential.InOut);

  AbdomenTween01.chain(AbdomenTween12);
  AbdomenTween12.chain(AbdomenTween23);
  AbdomenTween23.chain(AbdomenTween34);
  AbdomenTween34.chain(AbdomenTween45);
  AbdomenTween45.chain(AbdomenTween56);
  AbdomenTween56.chain(AbdomenTween01);

  AbdomenTween01.onUpdate(updateFunc);
  AbdomenTween12.onUpdate(updateFunc);
  AbdomenTween23.onUpdate(updateFunc);
  AbdomenTween34.onUpdate(updateFunc);
  AbdomenTween45.onUpdate(updateFunc);
  AbdomenTween56.onUpdate(updateFunc);

  AbdomenTween01.start();


  let BodyTran = new THREE.Vector3().copy(Body.position);
  const BodyQuad = new THREE.Quaternion().copy(Body.quaternion);

  const HeadQuad = new THREE.Quaternion().copy(Head.quaternion);
  const NeckQuad = new THREE.Quaternion().copy(Neck.quaternion);
  
  updateFunc = (transf) => {
    Body.position.addVectors(new THREE.Vector3(Body.position.x, BodyTran.y, Body.position.z), new THREE.Vector3(0, transf.ty, 0));
 
    Body.quaternion.x = BodyQuad.x;
    Body.quaternion.y = BodyQuad.y;
    Body.quaternion.z = BodyQuad.z;
    Body.quaternion.w = BodyQuad.w;

    const flag = wizard.right == true ? 1:0;
    Body.rotation.y += flag*Math.PI;

    Head.quaternion.multiplyQuaternions(HeadQuad, new THREE.Quaternion().identity());
    Neck.quaternion.multiplyQuaternions(NeckQuad, new THREE.Quaternion().identity());
  }

  const BodyTween01 = new TWEEN.Tween({tx:runBody[0].tx, ty:runBody[0].ty, tz:runBody[0].tz}, run).to({tx:runBody[1].tx, ty:runBody[1].ty, tz:runBody[1].tz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const BodyTween12 = new TWEEN.Tween({tx:runBody[1].tx, ty:runBody[1].ty, tz:runBody[1].tz}, run).to({tx:runBody[2].tx, ty:runBody[2].ty, tz:runBody[2].tz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const BodyTween23 = new TWEEN.Tween({tx:runBody[2].tx, ty:runBody[2].ty, tz:runBody[2].tz}, run).to({tx:runBody[3].tx, ty:runBody[3].ty, tz:runBody[3].tz}, 150).easing(TWEEN.Easing.Exponential.InOut);
  const BodyTween34 = new TWEEN.Tween({tx:runBody[3].tx, ty:runBody[3].ty, tz:runBody[3].tz}, run).to({tx:runBody[4].tx, ty:runBody[4].ty, tz:runBody[4].tz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const BodyTween45 = new TWEEN.Tween({tx:runBody[4].tx, ty:runBody[4].ty, tz:runBody[4].tz}, run).to({tx:runBody[5].tx, ty:runBody[5].ty, tz:runBody[5].tz}, 150).easing(TWEEN.Easing.Exponential.InOut);
  const BodyTween56 = new TWEEN.Tween({tx:runBody[5].tx, ty:runBody[5].ty, tz:runBody[5].tz}, run).to({tx:runBody[6].tx, ty:runBody[6].ty, tz:runBody[6].tz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const BodyTween67 = new TWEEN.Tween({tx:runBody[6].tx, ty:runBody[6].ty, tz:runBody[6].tz}, run).to({tx:runBody[7].tx, ty:runBody[7].ty, tz:runBody[7].tz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const BodyTween78 = new TWEEN.Tween({tx:runBody[7].tx, ty:runBody[7].ty, tz:runBody[7].tz}, run).to({tx:runBody[8].tx, ty:runBody[8].ty, tz:runBody[8].tz}, 150).easing(TWEEN.Easing.Exponential.InOut);
  const BodyTween89 = new TWEEN.Tween({tx:runBody[8].tx, ty:runBody[8].ty, tz:runBody[8].tz}, run).to({tx:runBody[9].tx, ty:runBody[9].ty, tz:runBody[9].tz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const BodyTween910 = new TWEEN.Tween({tx:runBody[9].tx, ty:runBody[9].ty, tz:runBody[9].tz}, run).to({tx:runBody[10].tx, ty:runBody[10].ty, tz:runBody[10].tz}, 50).easing(TWEEN.Easing.Exponential.InOut);
  const BodyTween1011 = new TWEEN.Tween({tx:runBody[10].tx, ty:runBody[10].ty, tz:runBody[10].tz}, run).to({tx:runBody[11].tx, ty:runBody[11].ty, tz:runBody[11].tz}, 100).easing(TWEEN.Easing.Exponential.InOut);
  const BodyTween1112 = new TWEEN.Tween({tx:runBody[11].tx, ty:runBody[11].ty, tz:runBody[11].tz}, run).to({tx:runBody[12].tx, ty:runBody[12].ty, tz:runBody[12].tz}, 150).easing(TWEEN.Easing.Exponential.InOut);
  
  BodyTween01.chain(BodyTween12);
  BodyTween12.chain(BodyTween23);
  BodyTween23.chain(BodyTween34);
  BodyTween34.chain(BodyTween45);
  BodyTween45.chain(BodyTween56);
  BodyTween56.chain(BodyTween67);
  BodyTween67.chain(BodyTween78);
  BodyTween78.chain(BodyTween89);
  BodyTween89.chain(BodyTween910);
  BodyTween910.chain(BodyTween1011);
  BodyTween1011.chain(BodyTween1112);
  BodyTween1112.chain(BodyTween01);

  BodyTween01.onUpdate(updateFunc);
  BodyTween12.onUpdate(updateFunc);
  BodyTween23.onUpdate(updateFunc);
  BodyTween34.onUpdate(updateFunc);
  BodyTween45.onUpdate(updateFunc);
  BodyTween56.onUpdate(updateFunc);
  BodyTween67.onUpdate(updateFunc);
  BodyTween78.onUpdate(updateFunc);
  BodyTween89.onUpdate(updateFunc);
  BodyTween910.onUpdate(updateFunc);
  BodyTween1011.onUpdate(updateFunc);
  BodyTween1112.onUpdate(updateFunc);

  BodyTween01.start();

}

function AnimPoseSetup() {

  const wizard = gameObjects.find((elem)=>elem.name == 'wizard');
  const root = wizard.root;

  let LowerLegR;
  let UpperLegR;
  let LowerLegL;
  let UpperLegL;
  let UpperArmR;
  let LowerArmR;
  let UpperArmL;
  let LowerArmL;
  let Torso;
  let Abdomen;
  let Body;
  let Neck;
  let Head;
  
  LowerLegR = root.getObjectByName('LowerLegR');
  UpperLegR = root.getObjectByName('UpperLegR');
  LowerLegL = root.getObjectByName('LowerLegL');
  UpperLegL = root.getObjectByName('UpperLegL');
  UpperArmR = root.getObjectByName('UpperArmR');
  LowerArmR = root.getObjectByName('LowerArmR');
  UpperArmL = root.getObjectByName('UpperArmL');
  LowerArmL = root.getObjectByName('LowerArmL');
  Torso = root.getObjectByName('Torso');
  Abdomen = root.getObjectByName('Abdomen');
  Body = root.getObjectByName('Body');
  Neck = root.getObjectByName('Neck');
  Head = root.getObjectByName('Head');

  const poseBody = [
    {tx:0.000, ty:0.000, tz:0.128, qx:0.000, qy:0.381, qz:0.000, qw:0.925},
    {tx:0.000, ty:0.000, tz:0.128, qx:0.004, qy:0.381, qz:0.002, qw:0.925},
    {tx:0.000, ty:0.000, tz:0.128, qx:0.000, qy:0.381, qz:0.000, qw:0.925}
  ];

  const poseTorso = [
    {qx:0.012, qy:-0.023, qz: 0.009, qw:1.000},
    {qx:0.025, qy:-0.023, qz: 0.016, qw:1.000},
    {qx:0.012, qy:-0.023, qz: 0.009, qw:1.000}
  ];

  // non va animato
  const poseAbdomen = [
    {qx:0.000, qy:-0.110, qz:0.027, qw:0.994},
    {qx:0.000, qy:-0.110, qz:0.027, qw:0.994},
    {qx:0.000, qy:-0.110, qz:0.027, qw:0.994}
  ];

  //non va animato
  const poseNeck = [
    {qx: 0.033, qy:0.000, qz:0.018, qw:0.999},
    {qx: 0.033, qy:0.000, qz:0.018, qw:0.999},
    {qx: 0.033, qy:0.000, qz:0.018, qw:0.999}
  ];

  const poseHead = [
    {qx:-0.078, qy:-0.221, qz:0.002, qw:0.968},
    {qx:-0.102, qy:-0.221, qz:-0.005, qw:0.970},
    {qx:-0.078, qy:-0.221, qz:0.002, qw:0.968}
  ];

  const poseUpperLegL = [
    {qx:-0.031, qy:-0.142, qz:-0.150, qw:0.978},
    {qx:-0.071, qy:-0.139, qz:-0.156, qw:0.975},
    {qx:-0.031, qy:-0.142, qz:-0.150, qw:0.978}
  ];

  const poseLowerLegL = [
    {qx:0.241, qy:0.000, qz:0.000, qw:0.971},
    {qx:0.316, qy:0.000, qz:0.000, qw:0.949},
    {qx:0.241, qy:0.000, qz:0.000, qw:0.971},
  ];

  const poseUpperLegR = [
    {rx:-21.3, ry:-3.32, rz:4.46},
    {rx:-25.9, ry:-3.21, rz:5.02},
    {rx:-21.3, ry:-3.32, rz:4.46},
  ];

  const poseLowerLegR = [
    {qx:0.379, qy:0.000, qz:0.000, qw:0.925},
    {qx:0.409, qy:0.000, qz:0.000, qw:0.913},
    {qx:0.379, qy:0.000, qz:0.000, qw:0.925}
  ];

  const poseUpperArmL = [
    {qx:-0.485, qy:-0.039, qz:0.195, qw:0.852},
    {qx:-0.455, qy:-0.009, qz:0.211, qw:0.865},
    {qx:-0.485, qy:-0.039, qz:0.195, qw:0.852}
  ];

  const poseLowerArmL = [
    {qx:-0.192, qy:0.069, qz:-0.210, qw:0.956},
    {qx:-0.159, qy:0.074, qz:-0.177, qw:0.968},
    {qx:-0.192, qy:0.069, qz:-0.210, qw:0.956}
  ];

  const poseUpperArmR = [
    {qx:-0.480, qy:0.198, qz:-0.079, qw:0.846},
    {qx:-0.474, qy:0.215, qz:-0.067, qw:0.847},
    {qx:-0.480, qy:0.198, qz:-0.079, qw:0.846}
  ];

  const poseLowerArmR = [
    {qx:-0.109, qy:-0.006, qz:0.015, qw:0.994},
    {qx:-0.115, qy:-0.025, qz:0.082, qw:0.990},
    {qx:-0.109, qy:-0.006, qz:0.015, qw:0.994}
  ];

  const BodyQuad = new THREE.Quaternion().copy(Body.quaternion);

  let updateFunc = (transf) => { 
    Body.quaternion.multiplyQuaternions(BodyQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
    const flag = wizard.right == true ? 1:0;
    Body.rotation.y += flag*Math.PI;
  }

  const BodyTween01 = new TWEEN.Tween({tx: poseBody[0].tx, ty:poseBody[0].ty, tz:poseBody[0].tz, qx:poseBody[0].qx, qy:poseBody[0].qy, qz:poseBody[0].qz, qw:poseBody[0].qw}, pose).to({tx: poseBody[1].tx, ty:poseBody[1].ty, tz:poseBody[1].tz, qx:poseBody[1].qx, qy:poseBody[1].qy, qz:poseBody[1].qz, qw:poseBody[1].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);
  const BodyTween12 = new TWEEN.Tween({tx: poseBody[1].tx, ty:poseBody[1].ty, tz:poseBody[1].tz, qx:poseBody[1].qx, qy:poseBody[1].qy, qz:poseBody[1].qz, qw:poseBody[1].qw}, pose).to({tx: poseBody[2].tx, ty:poseBody[2].ty, tz:poseBody[2].tz, qx:poseBody[2].qx, qy:poseBody[2].qy, qz:poseBody[2].qz, qw:poseBody[2].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);

  BodyTween01.chain(BodyTween12);
  BodyTween12.chain(BodyTween01);

  BodyTween01.onUpdate(updateFunc);
  BodyTween12.onUpdate(updateFunc);

  BodyTween01.start();
  

  const TorsoQuad = new THREE.Quaternion().copy(Torso.quaternion);

  updateFunc = (transf) => {
    Torso.quaternion.multiplyQuaternions(TorsoQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  }

  const TorsoTween01 = new TWEEN.Tween({qx:poseTorso[0].qx, qy:poseTorso[0].qy, qz:poseTorso[0].qz, qw:poseTorso[0].qw}, pose).to({qx:poseTorso[1].qx, qy:poseTorso[1].qy, qz:poseTorso[1].qz, qw:poseTorso[1].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);
  const TorsoTween12 = new TWEEN.Tween({qx:poseTorso[1].qx, qy:poseTorso[1].qy, qz:poseTorso[1].qz, qw:poseTorso[1].qw}, pose).to({qx:poseTorso[2].qx, qy:poseTorso[2].qy, qz:poseTorso[2].qz, qw:poseTorso[2].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);

  TorsoTween01.chain(TorsoTween12);
  TorsoTween12.chain(TorsoTween01);

  TorsoTween01.onUpdate(updateFunc);
  TorsoTween12.onUpdate(updateFunc);

  TorsoTween01.start();


  const AbdomenQuad = new THREE.Quaternion().copy(Abdomen.quaternion);

  updateFunc = (transf) => {
    Abdomen.quaternion.multiplyQuaternions(AbdomenQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  }

  const AbdomenTween01 = new TWEEN.Tween({qx:poseAbdomen[0].qx, qy:poseAbdomen[0].qy, qz:poseAbdomen[0].qz, qw:poseAbdomen[0].qw}, pose).to({qx:poseAbdomen[1].qx, qy:poseAbdomen[1].qy, qz:poseAbdomen[1].qz, qw:poseAbdomen[1].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);
  const AbdomenTween12 = new TWEEN.Tween({qx:poseAbdomen[1].qx, qy:poseAbdomen[1].qy, qz:poseAbdomen[1].qz, qw:poseAbdomen[1].qw}, pose).to({qx:poseAbdomen[2].qx, qy:poseAbdomen[2].qy, qz:poseAbdomen[2].qz, qw:poseAbdomen[2].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);

  AbdomenTween01.chain(AbdomenTween12);
  AbdomenTween12.chain(AbdomenTween01);

  AbdomenTween01.onUpdate(updateFunc);
  AbdomenTween12.onUpdate(updateFunc);

  AbdomenTween01.start();


  const NeckQuad = new THREE.Quaternion().copy(Neck.quaternion);

  updateFunc = (transf) => {
    Neck.quaternion.multiplyQuaternions(NeckQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  }

  const NeckTween01 = new TWEEN.Tween({qx:poseNeck[0].qx, qy:poseNeck[0].qy, qz:poseNeck[0].qz, qw:poseNeck[0].qw}, pose).to({qx:poseNeck[1].qx, qy:poseNeck[1].qy, qz:poseNeck[1].qz, qw:poseNeck[1].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);
  const NeckTween12 = new TWEEN.Tween({qx:poseNeck[1].qx, qy:poseNeck[1].qy, qz:poseNeck[1].qz, qw:poseNeck[1].qw}, pose).to({qx:poseNeck[2].qx, qy:poseNeck[2].qy, qz:poseNeck[2].qz, qw:poseNeck[2].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);

  NeckTween01.chain(NeckTween12);
  NeckTween12.chain(NeckTween01);

  NeckTween01.onUpdate(updateFunc);
  NeckTween12.onUpdate(updateFunc);

  NeckTween01.start();


  const HeadQuad = new THREE.Quaternion().copy(Head.quaternion);

  updateFunc = (transf) => {
    Head.quaternion.multiplyQuaternions(HeadQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  }

  const HeadTween01 = new TWEEN.Tween({qx:poseHead[0].qx, qy:poseHead[0].qy, qz:poseHead[0].qz, qw:poseHead[0].qw}, pose).to({qx:poseHead[1].qx, qy:poseHead[1].qy, qz:poseHead[1].qz, qw:poseHead[1].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);
  const HeadTween12 = new TWEEN.Tween({qx:poseHead[1].qx, qy:poseHead[1].qy, qz:poseHead[1].qz, qw:poseHead[1].qw}, pose).to({qx:poseHead[2].qx, qy:poseHead[2].qy, qz:poseHead[2].qz, qw:poseHead[2].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);

  HeadTween01.chain(HeadTween12);
  HeadTween12.chain(HeadTween01);

  HeadTween01.onUpdate(updateFunc);
  HeadTween12.onUpdate(updateFunc);

  HeadTween01.start();


  const UpperLegLQuad = new THREE.Quaternion().copy(UpperLegL.quaternion);
 
  updateFunc = (transf) => {
    UpperLegL.quaternion.multiplyQuaternions(UpperLegLQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  }

  const UpperLegLTween01 = new TWEEN.Tween({qx:poseUpperLegL[0].qx, qy:poseUpperLegL[0].qy, qz:poseUpperLegL[0].qz, qw:poseUpperLegL[0].qw}, pose).to({qx:poseUpperLegL[1].qx, qy:poseUpperLegL[1].qy, qz:poseUpperLegL[1].qz, qw:poseUpperLegL[1].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegLTween12 = new TWEEN.Tween({qx:poseUpperLegL[1].qx, qy:poseUpperLegL[1].qy, qz:poseUpperLegL[1].qz, qw:poseUpperLegL[1].qw}, pose).to({qx:poseUpperLegL[2].qx, qy:poseUpperLegL[2].qy, qz:poseUpperLegL[2].qz, qw:poseUpperLegL[2].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);

  UpperLegLTween01.chain(UpperLegLTween12);
  UpperLegLTween12.chain(UpperLegLTween01);

  UpperLegLTween01.onUpdate(updateFunc);
  UpperLegLTween12.onUpdate(updateFunc);

  UpperLegLTween01.start();



  const LowerLegLQuad = new THREE.Quaternion().copy(LowerLegL.quaternion);

  updateFunc = (transf) => {
    LowerLegL.quaternion.multiplyQuaternions(LowerLegLQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  }

  const LowerLegLTween01 = new TWEEN.Tween({qx:poseLowerLegL[0].qx, qy:poseLowerLegL[0].qy, qz:poseLowerLegL[0].qz, qw:poseLowerLegL[0].qw}, pose).to({qx:poseLowerLegL[1].qx, qy:poseLowerLegL[1].qy, qz:poseLowerLegL[1].qz, qw:poseLowerLegL[1].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegLTween12 = new TWEEN.Tween({qx:poseLowerLegL[1].qx, qy:poseLowerLegL[1].qy, qz:poseLowerLegL[1].qz, qw:poseLowerLegL[1].qw}, pose).to({qx:poseLowerLegL[2].qx, qy:poseLowerLegL[2].qy, qz:poseLowerLegL[2].qz, qw:poseLowerLegL[2].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);

  LowerLegLTween01.chain(LowerLegLTween12);
  LowerLegLTween12.chain(LowerLegLTween01);

  LowerLegLTween01.onUpdate(updateFunc);
  LowerLegLTween12.onUpdate(updateFunc);

  LowerLegLTween01.start();

  const UpperLegRRot = new THREE.Vector3(UpperLegR.rotation.x, UpperLegR.rotation.y, UpperLegR.rotation.z);
  
  updateFunc = (transf) => {
    UpperLegR.rotation.setFromVector3(new THREE.Vector3().addVectors(UpperLegRRot, new THREE.Vector3(transf.rx*(Math.PI/180), transf.ry*(Math.PI/180), transf.rz*(Math.PI/180))));
  }

  const UpperLegRTween01 = new TWEEN.Tween({rx:poseUpperLegR[0].rx, ry:poseUpperLegR[0].ry, rz:poseUpperLegR[0].rz}, pose).to({rx:poseUpperLegR[1].rx, ry:poseUpperLegR[1].ry, rz:poseUpperLegR[1].rz}, 1000).easing(TWEEN.Easing.Exponential.InOut);
  const UpperLegRTween12 = new TWEEN.Tween({rx:poseUpperLegR[1].rx, ry:poseUpperLegR[1].ry, rz:poseUpperLegR[1].rz}, pose).to({rx:poseUpperLegR[2].rx, ry:poseUpperLegR[2].ry, rz:poseUpperLegR[2].rz}, 1000).easing(TWEEN.Easing.Exponential.InOut);

  UpperLegRTween01.chain(UpperLegRTween12);
  UpperLegRTween12.chain(UpperLegRTween01);

  UpperLegRTween01.onUpdate(updateFunc);
  UpperLegRTween12.onUpdate(updateFunc);

  UpperLegRTween01.start();


  const LowerLegRQuad = new THREE.Quaternion().copy(LowerLegR.quaternion);

  updateFunc = (transf) => {
    LowerLegR.quaternion.multiplyQuaternions(LowerLegRQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  }

  const LowerLegRTween01 = new TWEEN.Tween({qx:poseLowerLegR[0].qx, qy:poseLowerLegR[0].qy, qz:poseLowerLegR[0].qz, qw:poseLowerLegR[0].qw}, pose).to({qx:poseLowerLegR[1].qx, qy:poseLowerLegR[1].qy, qz:poseLowerLegR[1].qz, qw:poseLowerLegR[1].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);
  const LowerLegRTween12 = new TWEEN.Tween({qx:poseLowerLegR[1].qx, qy:poseLowerLegR[1].qy, qz:poseLowerLegR[1].qz, qw:poseLowerLegR[1].qw}, pose).to({qx:poseLowerLegR[2].qx, qy:poseLowerLegR[2].qy, qz:poseLowerLegR[2].qz, qw:poseLowerLegR[2].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);

  LowerLegRTween01.chain(LowerLegRTween12);
  LowerLegRTween12.chain(LowerLegRTween01);

  LowerLegRTween01.onUpdate(updateFunc);
  LowerLegRTween12.onUpdate(updateFunc);

  LowerLegRTween01.start();


  const UpperArmLQuad = new THREE.Quaternion().copy(UpperArmL.quaternion);

  updateFunc = (transf) => {
    UpperArmL.quaternion.multiplyQuaternions(UpperArmLQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  }

  const UpperArmLTween01 = new TWEEN.Tween({qx:poseUpperArmL[0].qx, qy:poseUpperArmL[0].qy, qz:poseUpperArmL[0].qz, qw:poseUpperArmL[0].qw}, pose).to({qx:poseUpperArmL[1].qx, qy:poseUpperArmL[1].qy, qz:poseUpperArmL[1].qz, qw:poseUpperArmL[1].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmLTween12 = new TWEEN.Tween({qx:poseUpperArmL[1].qx, qy:poseUpperArmL[1].qy, qz:poseUpperArmL[1].qz, qw:poseUpperArmL[1].qw}, pose).to({qx:poseUpperArmL[2].qx, qy:poseUpperArmL[2].qy, qz:poseUpperArmL[2].qz, qw:poseUpperArmL[2].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);

  UpperArmLTween01.chain(UpperArmLTween12);
  UpperArmLTween12.chain(UpperArmLTween01);

  UpperArmLTween01.onUpdate(updateFunc);
  UpperArmLTween12.onUpdate(updateFunc);

  UpperArmLTween01.start();


  const LowerArmLQuad = new THREE.Quaternion().copy(LowerArmL.quaternion);

  updateFunc = (transf) => {
    LowerArmL.quaternion.multiplyQuaternions(LowerArmLQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  }

  const LowerArmLTween01 = new TWEEN.Tween({qx:poseLowerArmL[0].qx, qy:poseLowerArmL[0].qy, qz:poseLowerArmL[0].qz, qw:poseLowerArmL[0].qw}, pose).to({qx:poseLowerArmL[1].qx, qy:poseLowerArmL[1].qy, qz:poseLowerArmL[1].qz, qw:poseLowerArmL[1].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmLTween12 = new TWEEN.Tween({qx:poseLowerArmL[1].qx, qy:poseLowerArmL[1].qy, qz:poseLowerArmL[1].qz, qw:poseLowerArmL[1].qw}, pose).to({qx:poseLowerArmL[2].qx, qy:poseLowerArmL[2].qy, qz:poseLowerArmL[2].qz, qw:poseLowerArmL[2].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);

  LowerArmLTween01.chain(LowerArmLTween12);
  LowerArmLTween12.chain(LowerArmLTween01);

  LowerArmLTween01.onUpdate(updateFunc);
  LowerArmLTween12.onUpdate(updateFunc);

  LowerArmLTween01.start();


  const UpperArmRQuad = new THREE.Quaternion().copy(UpperArmR.quaternion);

  updateFunc = (transf) => {
    UpperArmR.quaternion.multiplyQuaternions(UpperArmRQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  }

  const UpperArmRTween01 = new TWEEN.Tween({qx:poseUpperArmR[0].qx, qy:poseUpperArmR[0].qy, qz:poseUpperArmR[0].qz, qw:poseUpperArmR[0].qw}, pose).to({qx:poseUpperArmR[1].qx, qy:poseUpperArmR[1].qy, qz:poseUpperArmR[1].qz, qw:poseUpperArmR[1].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);
  const UpperArmRTween12 = new TWEEN.Tween({qx:poseUpperArmR[1].qx, qy:poseUpperArmR[1].qy, qz:poseUpperArmR[1].qz, qw:poseUpperArmR[1].qw}, pose).to({qx:poseUpperArmR[2].qx, qy:poseUpperArmR[2].qy, qz:poseUpperArmR[2].qz, qw:poseUpperArmR[2].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);

  UpperArmRTween01.chain(UpperArmRTween12);
  UpperArmRTween12.chain(UpperArmRTween01);

  UpperArmRTween01.onUpdate(updateFunc);
  UpperArmRTween12.onUpdate(updateFunc);

  UpperArmRTween01.start();


  const LowerArmRQuad = new THREE.Quaternion().copy(LowerArmR.quaternion);

  updateFunc = (transf) => {
    LowerArmR.quaternion.multiplyQuaternions(LowerArmRQuad, new THREE.Quaternion(transf.qx, transf.qy, transf.qz, transf.qw));
  }

  const LowerArmRTween01 = new TWEEN.Tween({qx:poseLowerArmR[0].qx, qy:poseLowerArmR[0].qy, qz:poseLowerArmR[0].qz, qw:poseLowerArmR[0].qw}, pose).to({qx:poseLowerArmR[1].qx, qy:poseLowerArmR[1].qy, qz:poseLowerArmR[1].qz, qw:poseLowerArmR[1].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);
  const LowerArmRTween12 = new TWEEN.Tween({qx:poseLowerArmR[1].qx, qy:poseLowerArmR[1].qy, qz:poseLowerArmR[1].qz, qw:poseLowerArmR[1].qw}, pose).to({qx:poseLowerArmR[2].qx, qy:poseLowerArmR[2].qy, qz:poseLowerArmR[2].qz, qw:poseLowerArmR[2].qw}, 1000).easing(TWEEN.Easing.Exponential.InOut);

  LowerArmRTween01.chain(LowerArmRTween12);
  LowerArmRTween12.chain(LowerArmRTween01);

  LowerArmRTween01.onUpdate(updateFunc);
  LowerArmRTween12.onUpdate(updateFunc);

  LowerArmRTween01.start();
  
}

// *** input manager *** //

class InputManager {

    constructor() {
      this.keys = {};
      const keyMap = new Map();
   
      const setKey = (keyName, pressed) => {
        const keyState = this.keys[keyName];
        keyState.justPressed = pressed && !keyState.down;
        keyState.down = pressed;
      };
   
      const addKey = (keyCode, name) => {
        this.keys[name] = { down: false, justPressed: false };
        keyMap.set(keyCode, name);
      };
   
      const setKeyFromKeyCode = (keyCode, pressed) => {
        const keyName = keyMap.get(keyCode);
        if (!keyName) {
          return;
        }
        setKey(keyName, pressed);
      };
   
      addKey(37, 'left');
      addKey(39, 'right');
      addKey(38, 'up');
      addKey(40, 'down');
      addKey(87, 'w');
      addKey(83, 's');
      addKey(65, 'a');
      addKey(68, 'd');
      addKey(16, 'shift')
   
      window.addEventListener('keydown', (e) => {
        setKeyFromKeyCode(e.keyCode, true);
      });
      window.addEventListener('keyup', (e) => {
        setKeyFromKeyCode(e.keyCode, false);
      });
    }

    update() {
      for (const keyState of Object.values(this.keys)) {
        if (keyState.justPressed) {
          keyState.justPressed = false;
        }
      }
    }
}

const inputManager = new InputManager();

// Physics engine initialization //

let world;
let bodyDragon, bodyWizard, groundBody, wallBody1, wallBody2;
let physicsContactMaterial;
let debug;

const ballShape = new CANNON.Sphere(0.2);
const ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32,32);
const materialBlue = new THREE.MeshStandardMaterial({color: 0x0000ff});
const materialRed = new THREE.MeshStandardMaterial({color: 0xff0000});
const balls = [];
const ballMeshes = [];
const removeBody = [];
const removeMesh = [];

let hitDragon = 0;
let hitWizard = 0;

function initCannon() {

  world = new CANNON.World();
  world.gravity.set(0,-20,0);
  world.broadphase = new CANNON.NaiveBroadphase();
  const solver = new CANNON.GSSolver();
  solver.iterations = 7;
  solver.tolerance = 0.1;
  world.solver = new CANNON.SplitSolver(solver);

  const physicsMaterial = new CANNON.Material("slipperyMaterial");
  physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
                                                      physicsMaterial,
                                                      0.0, // friction coefficient
                                                      0.1  // restitution
                                                      );
  // We must add the contact materials to the world
  world.addContactMaterial(physicsContactMaterial);

  // Create a planes
  let groundShape = new CANNON.Plane(planeSize, planeSize);
  groundBody = new CANNON.Body({ mass: 0 });
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
  world.addBody(groundBody);

  wallBody1 = new CANNON.Body({mass:0});
  wallBody1.addShape(groundShape);
  wallBody1.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),-Math.PI/2);
  wallBody1.position.set(3.500/2, 0, 0);
  world.addBody(wallBody1);

  wallBody2 = new CANNON.Body({mass:0});
  wallBody2.addShape(groundShape);
  wallBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),Math.PI/2);
  wallBody2.position.set(-3.500/2, 0, 0);
  world.addBody(wallBody2);

  // bounding box dragon
  let shapeDragon = new CANNON.Box(new CANNON.Vec3(3.408/2, 3.852/2, 3.711/2));
  bodyDragon = new CANNON.Body({
    mass: 200
  });
  bodyDragon.addShape(shapeDragon);
  world.addBody(bodyDragon);
  bodyDragon.position.set(0,3.852/2,-5);
  bodyDragon.addEventListener('collide', ()=>{
    bodyDragon.velocity.setZero();
    bodyDragon.angularVelocity.setZero();
  });

  //bounding box wizard
  let shapeWizard = new CANNON.Box(new CANNON.Vec3(3.052/2, 3.0/2, 2.0/2)); //0.878
  bodyWizard = new CANNON.Body({
    mass: 60
  });
  bodyWizard.addShape(shapeWizard);
  world.addBody(bodyWizard);
  bodyWizard.position.set(0,2.3/2,5);
  bodyWizard.addEventListener('collide', ()=>{
    bodyWizard.velocity.setZero();
    bodyWizard.angularVelocity.setZero();
  });

  debug = new CannonDebugRenderer(scene, world);
}

initCannon();

// *** render loop *** //

const globals = {
  time: 0,
  deltaTime: 0,
}
let then = 0;
function render(now) {

   // time management 

    now *= 0.001; //   to seconds
    const deltaTime = Math.min(now - then, 1/20);
    then = now;

    globals.time = now;
    globals.deltaTime = deltaTime;

    // remove objects to be removed

    for(let i=0; i<removeBody.length; i++) {
      if(removeBody[i]){
        world.removeBody(removeBody[i]);
        scene.remove(removeMesh[i]);
      }
    }
  
    // update the scene and the world

    world.step(deltaTime);
    for(const elem of gameObjects) {
      if(elem!==undefined && elem.update!==undefined){
        elem.update(); 
      }
    }
    for(let i=0; i<balls.length; i++){
      if(balls[i]){
        ballMeshes[i].position.copy(balls[i].position);
        ballMeshes[i].quaternion.copy(balls[i].quaternion);
      }
    }
    inputManager.update();
    //debug.update();

    document.getElementById("dragon").innerHTML = hitDragon;
    document.getElementById("wizard").innerHTML = hitWizard;

    // render the scene
    
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

requestAnimationFrame(render);
}

main();
