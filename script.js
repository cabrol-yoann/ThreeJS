import * as THREE from 'three';

// ---------------- VARIABLES ----------------
// Scène
var scene;
var renderer;
var camera;
var baseArbre;

baseArbre = new THREE.Group();

// Variables d'animation
var rotationSpeed = 0.005;

function start() {
    scene = new THREE.Scene();

    // ---------------- RENDERER ----------------
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff, 1);

    // ---------------- CAMERA ----------------
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 70);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    // ---------------- LIGHTS ----------------
    var myAmbientLight = new THREE.AmbientLight(0xd0d0d0);
    scene.add(myAmbientLight);

    var directionalLight = new THREE.DirectionalLight(0xd0d0d0);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    // ---------------- OBJECTS ----------------
    ajout_Arbre(0, -30);
    scene.add(baseArbre);

    // ---------------- RENDER SCENE ----------------
    toRender();
}

start();

function toRender() {
    baseArbre.rotation.y += rotationSpeed; // Rotation de l'arbre

    renderer.render(scene, camera);
    requestAnimationFrame(toRender);
}


function ajout_Arbre(x, y) {
    // texture
    var textureLoader = new THREE.TextureLoader();
    var texture_oak = textureLoader.load('images/oak_Log.webp');
    var texture_leaves = textureLoader.load('images/oak_leaves.webp');

    const bucheGeometry = new THREE.BoxGeometry(10, 10, 10);
    const bucheMaterial = new THREE.MeshStandardMaterial({ map: texture_oak });

    const geometryFeuille = new THREE.BoxGeometry(10, 10, 10);
    const materialFeuille = new THREE.MeshStandardMaterial({ map: texture_leaves });

    // création des mesh et ajout comme fils de la base de l'arbre
    // feuilles
    // plan 1
    for(var l = 0; l < 2; l++) {
        for(var i = 0; i < 3; i++) {
            var feuille_plan1 = new THREE.Mesh(geometryFeuille, materialFeuille);
            feuille_plan1.position.set(10-10*i + x, 10 + y, 10);
            baseArbre.add(feuille_plan1);
        }
    }

    // plan 2
    for(var l = 0; l < 2; l++) {
        for(var i = 0; i < 3; i++) {
            var feuille_plan2 = new THREE.Mesh(geometryFeuille, materialFeuille);
            feuille_plan2.position.set(10-10*i + x, 20+10*l + y, 0);
            baseArbre.add(feuille_plan2);
        }
    }
    var feuille2_plan2 = new THREE.Mesh(geometryFeuille, materialFeuille);
    feuille2_plan2.position.set( 0+ x, 40 + y, 0);
    baseArbre.add(feuille2_plan2);
    
    // plan 3
    for(var l = 0; l < 2; l++) {
        for(var i = 0; i < 3; i++) {
            var feuille_plan3 = new THREE.Mesh(geometryFeuille, materialFeuille);
            feuille_plan3.position.set(10-+10*i + x, 20+  10*l + y, -10);
            baseArbre.add(feuille_plan3);
        }
    }

    //plan 4


    // buches
    for (var i = 0; i < 4; i++) {
        var buche = new THREE.Mesh(bucheGeometry, bucheMaterial);
        buche.position.set(0 + x, 10 * i + y, 0);
        baseArbre.add(buche);
    }
}
