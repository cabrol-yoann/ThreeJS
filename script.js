import * as THREE from 'three';

// ---------------- VARIABLES ----------------
// Scène
var scene;
var renderer;
var camera;
var isPaused = true;

// Groupes
var group_pere = new THREE.Group();
// groupe fils de la scène
var baseArbre = new THREE.Group();
var sky_base = new THREE.Group();

// ajout des groupes fils au groupe père
group_pere.add(baseArbre);
group_pere.add(sky_base);

// Variables d'animation
var rotationSpeed = 0.005;

// gestion du clavier

function logKey(e) {
    if (e = "p")
        isPaused = !isPaused;
}

// ---------------- GEOMETRIES ----------------
const cube_Geometry = new THREE.BoxGeometry(5, 5, 5);


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
    ajout_Arbre(0, -10);
    ajout_skyBase();
    ajout_ciel();

    scene.add(group_pere);

    // ---------------- RENDER SCENE ----------------
    toRender();
}

start();

function toRender() {
    if (!isPaused)
        group_pere.rotation.y += rotationSpeed; // Rotation de l'arbre

    renderer.render(scene, camera);
    requestAnimationFrame(toRender);

    // si la touc<he p est appuyée, on stope la rotation avec la variable isPaused
    document.addEventListener("keypress", logKey);
}




function ajout_Arbre(x, y) {
    // texture
    var textureLoader = new THREE.TextureLoader();
    var texture_oak = textureLoader.load('images/oak_Log.webp');
    var texture_leaves = textureLoader.load('images/oak_leaves.webp');

    // matériaux
    const bucheMaterial = new THREE.MeshStandardMaterial({ map: texture_oak });
    const materialFeuille = new THREE.MeshStandardMaterial({ map: texture_leaves });

    // création des mesh et ajout comme fils de la base de l'arbre
    // feuilles
    // plan 1
    for(var l = 0; l < 5; l++) {
        for(var i = 0; i < 5; i++) {
            var feuille_plan1 = new THREE.Mesh(cube_Geometry, materialFeuille);
            feuille_plan1.position.set(10-5*i + x, 15 + y, 10+(-5*l));
            //on ne souhaite pas afficher les 4 feuilles au angles
            if ((i == 0 && l != 0) && (i == 0 && l != 4) || (i==1) || (i==2) || (i==3) || (i==4 && l != 0) && (i==4 && l != 4))
                baseArbre.add(feuille_plan1);
        }
    }

    // plan 2
    for(var l = 0; l < 5; l++) {
        for(var i = 0; i < 5; i++) {
            var feuille_plan1 = new THREE.Mesh(cube_Geometry, materialFeuille);
            feuille_plan1.position.set(10-5*i + x, 20 + y, 10+(-5*l));
            baseArbre.add(feuille_plan1);
        }
    }

    // plan 3
    for(var l = 0; l < 3; l++) {
        for(var i = 0; i < 3; i++) {
            var feuille_plan3 = new THREE.Mesh(cube_Geometry, materialFeuille);
            feuille_plan3.position.set(5-5*i + x, 25 + y, 5+(-5*l));
            baseArbre.add(feuille_plan3);
        }
    }

    //plan 4
    for(var l = 0; l < 3; l++) {
        for(var i = 0; i < 3; i++) {
            var feuille_plan4 = new THREE.Mesh(cube_Geometry, materialFeuille);
            feuille_plan4.position.set(5-5*i + x, 30 + y, 5+(-5*l));
            if ((i == 0 && l != 0) && (i == 0 && l != 2) || (i==1) || (i==2 && l != 0) && (i==2 && l != 2))
                baseArbre.add(feuille_plan4);
        }
    }

    // buches
    for (var i = 0; i < 4; i++) {
        var buche = new THREE.Mesh(cube_Geometry, bucheMaterial);
        buche.position.set(0 + x, 5 * i + y, 0);
        baseArbre.add(buche);
    }
}

function ajout_skyBase() {
    // texture
    var textureLoader = new THREE.TextureLoader();
    var texture_Dirt = textureLoader.load('images/dirt.png');
    var texture_Grass_Side = textureLoader.load('images/grass_block_side.png');
    //var texture_Grass_top = textureLoader.load('images/grass_block_top.png');
    
    // géométrie et matériaux
    const DirtMaterial = new THREE.MeshBasicMaterial({ map: texture_Dirt });
    const grassMaterial = new THREE.MeshBasicMaterial({ map: texture_Grass_Side });

    // création des mesh et ajout comme fils de la base de l'arbre
    // dirt
    // plan 1
    for(var l = 0; l < 3; l++) {
        for(var i = 0; i < 6; i++) {
            var dirt = new THREE.Mesh(cube_Geometry, DirtMaterial);
            dirt.position.set(5*i, -25, 10+(-5*l));
            sky_base.add(dirt);
        }
    }

    // plan 2
    for(var l = 0; l < 3; l++) {
        for(var i = 0; i < 6; i++) {
            var dirt = new THREE.Mesh(cube_Geometry, DirtMaterial);
            dirt.position.set(5*i, -20, 10+(-5*l));
            sky_base.add(dirt);
        }
    }

    // grass
    // plan 1
    for (var l = 0; i < 3; l++) {
        for (var i = 0; i < 6; i++) {
            var grass = new THREE.Mesh(cube_Geometry, grassMaterial);
            grass.position.set(5*i, -15, 10+(-5*l));
            sky_base.add(grass);
        }
    }
}

function ajout_ciel() {
    const skyGeometry = new THREE.BoxGeometry(500, 500, 500);
    const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide });

    var sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
}