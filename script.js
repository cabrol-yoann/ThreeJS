import * as THREE from 'three';

// To Do
// - Ajouter les texture de steve
// - Finir le cycle jour/nuit avec mode minecraft et modification de la couleur de fond
// - Faire le coffre avec les bonne texture


// ---------------- VARIABLES ----------------
// Scène
var scene;
var renderer;
var camera;
var isPaused = true;
var zoom = 70;

// Groupes
var group_pere = new THREE.Group();
// groupe fils de la scène
var baseArbre = new THREE.Group();
var sky_base = new THREE.Group();
var groupe_Steve = new THREE.Group();
var groupe_soleil = new THREE.Group();

// ajout des groupes fils au groupe père
group_pere.add(baseArbre);
group_pere.add(sky_base);
group_pere.add(groupe_Steve);


// Variables d'animation
var rotationSpeed = -0.005;

// gestion du clavier
function key_pause(e) {
    if (e.key === "p")
        isPaused = !isPaused;
}

function key_zoom(e) {
    if (e.key === "+")
        camera.position.set(0, 40, zoom+=10);
    if (e.key === "-")
        camera.position.set(0, 40, zoom-=10);  
}

// Gestion de la souris

function cursor_pos(e) {
    if(e.clicked) {
        var x = e.clientX;
        var y = e.clientY;
        camera.position.set(x, y, zoom);
    }
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
    camera.position.set(0, 40, zoom);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    // ---------------- LIGHTS ----------------
    var myAmbientLight = new THREE.AmbientLight(0xd0d0d0);
    scene.add(myAmbientLight);

    var directionalLight = new THREE.DirectionalLight(0xa0a0a0);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    // ---------------- OBJECTS ----------------
    ajout_ciel();
    ajout_Arbre(-10, 0);
    ajout_skyBase(-10, 0);
    ajout_soleil(25,50,1) // 3ème paramètre : 0 = minecraft, 1 = ronds
    ajout_steve(10, 0);

    scene.add(group_pere);
    scene.add(groupe_soleil);

    // ---------------- RENDER SCENE ----------------
    toRender();
}

start();

function toRender() {
    if (!isPaused)
        group_pere.rotation.y += rotationSpeed; // Rotation de l'arbre
    groupe_soleil.rotation.z += -0.0005; // Rotation du soleil

    renderer.render(scene, camera);
    requestAnimationFrame(toRender);

    // si la touche p est appuyée, on stoppe la rotation avec la variable isPaused
    document.addEventListener("keypress", key_pause);
    document.addEventListener("keypress", key_zoom);
    document.addEventListener("click", cursor_pos);
}

function ajout_ciel() {
    const skyGeometry = new THREE.BoxGeometry(500, 500, 500);
    const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.BackSide });

    var sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
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
    for (var p = 0; p < 4; p++) {
        for(var l = 0; l < 5; l++) {
            for(var i = 0; i < 5; i++) {
                
                // on donne une forme particulière à l'arbre pour qu'il ressemble à un arbre de minecraft
                if ((p==0 && ((l!=0 && l!=4) || (i!=0 && i!= 4)) ) || (p==1) || (p==2 && ((l!=0 && l!=4) && (i!=0 && i!=4))) || (p==3 && ((l!=0 && l!=4) && ((i!=0 && i!=4)) && ((l!=1 && l!=3) || (i!=1 && i!= 3)) )))
                {
                    var feuille_plan1 = new THREE.Mesh(cube_Geometry, materialFeuille);
                    feuille_plan1.position.set(10-5*i + x, 15 +(5*p) + y, 10+(-5*l));
                    baseArbre.add(feuille_plan1);
                }
            }
        }
    }

    // buches
    for (var i = 0; i < 4; i++) {
        var buche = new THREE.Mesh(cube_Geometry, bucheMaterial);
        buche.position.set(0 + x, 5 * i + y, 0);
        baseArbre.add(buche);
    }
}

function ajout_skyBase(x,y) {
    // texture
    var textureLoader = new THREE.TextureLoader();
    var texture_Dirt = textureLoader.load('images/dirt.png');
    var texture_Grass_Side = textureLoader.load('images/grass_block_snow.png');
    var texture_Grass_top = textureLoader.load('images/grass_block_snow_top.png');
    var texture_Grass_bottom = textureLoader.load('images/grass_block_bottom.png');
    var texture_Coffre = textureLoader.load('images/chest.png');
    var texture_Coffre_Right = textureLoader.load('images/chest_right.png');
    var texture_Coffre_Left = textureLoader.load('images/chest_left.png');

    // géométrie et matériaux
    const DirtMaterial = new THREE.MeshBasicMaterial({ map: texture_Dirt });
    // Créez un matériau pour chaque face du cube
    const grassMaterial = [
        new THREE.MeshBasicMaterial({ map: texture_Grass_Side }),
        new THREE.MeshBasicMaterial({ map: texture_Grass_Side}),
        new THREE.MeshBasicMaterial({ map: texture_Grass_top }),
        new THREE.MeshBasicMaterial({ map: texture_Grass_bottom }),
        new THREE.MeshBasicMaterial({ map: texture_Grass_Side }),
        new THREE.MeshBasicMaterial({ map: texture_Grass_Side })
    ];
    const coffreMaterial = [
        new THREE.MeshBasicMaterial({ map: texture_Coffre_Left }),
        new THREE.MeshBasicMaterial({ map: texture_Coffre_Right}),
        new THREE.MeshBasicMaterial({ map: texture_Coffre }),
        new THREE.MeshBasicMaterial({ map: texture_Coffre }),
        new THREE.MeshBasicMaterial({ map: texture_Coffre }),
        new THREE.MeshBasicMaterial({ map: texture_Coffre })
    ]

    // création des mesh et ajout comme fils
    // grass
    for(var l = 0; l < 3; l++) {
        for(var i = 0; i < 6; i++) {
            if(l!=2 || i!=0) {
                var grass = new THREE.Mesh(cube_Geometry, grassMaterial);
                grass.position.set(5*i+x, -5+y, 10+(-5*l));
                sky_base.add(grass);
            }
            else {
                var dirt = new THREE.Mesh(cube_Geometry, DirtMaterial);
                dirt.position.set(5*i+x, -5+y, 10+(-5*l));
                sky_base.add(dirt);
            }
        }
    }
    
    // dirt
    for(var p = 0; p < 2; p++) {
        for(var l = 0; l < 3; l++) {
            for(var i = 0; i < 6; i++) {
                var dirt = new THREE.Mesh(cube_Geometry, DirtMaterial);
                dirt.position.set(5*i+x, -15+(5*p)+y, 10+(-5*l));
                sky_base.add(dirt);
            }
        }
    }

    // ajout d'une zone pour finir l'île
    // grass
    for(var l = 0; l < 2; l++) {
        for(var i = 0; i < 3; i++) {
            if(l!=0 || i!=1) {
                var grass = new THREE.Mesh(cube_Geometry, grassMaterial);
                grass.position.set(15+5*i+x, -5+y, 20+(-5*l));
                sky_base.add(grass);
            }
            else {
                var dirt = new THREE.Mesh(cube_Geometry, DirtMaterial);
                dirt.position.set(15+5*i+x, -5+y, 20+(-5*l));
                sky_base.add(dirt);
            }
        }
    }

    // dirt
    for(var p = 0; p < 2; p++) {
        for(var l = 0; l < 2; l++) {
            for(var i = 0; i < 3; i++) {
                var dirt = new THREE.Mesh(cube_Geometry, DirtMaterial);
                dirt.position.set(15+5*i+x, -15+(5*p)+y, 20+(-5*l));
                sky_base.add(dirt);
            }
        }
    }

    // ajout d'un coffre
    var coffre = new THREE.Mesh(cube_Geometry, coffreMaterial);
    coffre.position.set(20+x, y, 20);
    sky_base.add(coffre);

}

function ajout_steve(x,y) {
    // texture
    /*
    var textureLoader = new THREE.TextureLoader();
    var texture_Jambe_droite = textureLoader.load('images/steve_leg_right.png');
    var texture_Jambe_gauche = textureLoader.load('images/steve_leg_left.png');
    var texture_Corps = textureLoader.load('images/steve_body.png');
    var texture_Tete = textureLoader.load('images/steve_head.png');
    var texture_Bras_droit = textureLoader.load('images/steve_arm_right.png');
    var texture_Bras_gauche = textureLoader.load('images/steve_arm_left.png');
    */
    // géométrie et matériaux
    const jambe_DroiteMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const jambe_GaucheMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const corpsMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const teteMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const bras_DroitMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const bras_GaucheMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // steve doit faire 32 pixel de haut avec pour la tête 8 pixel de haut, le corp 12 pixel de haut et les jambes 12 pixel de haut
    const jambe_DroiteGeometry = new THREE.BoxGeometry(2, 3.5, 3);          //Jambe
    const jambe_GaucheGeometry = new THREE.BoxGeometry(2, 3.5, 3);
    const corpsGeometry = new THREE.BoxGeometry(5, 3.5, 3);               //Corps
    const teteGeometry = new THREE.BoxGeometry(3, 3, 3);                    //Tête
    const bras_DroitGeometry = new THREE.BoxGeometry(2, 3.5, 3);            //Bras
    const bras_GaucheGeometry = new THREE.BoxGeometry(2, 3.5, 3);

    // création des mesh et ajout comme fils de la base de l'arbre
    // JAMBES
    // jambe droite
    var jambe_Droite = new THREE.Mesh(jambe_DroiteGeometry, jambe_DroiteMaterial);
    jambe_Droite.position.set(-1 + x, 0 + y, 0);
    groupe_Steve.add(jambe_Droite);

    // jambe gauche
    var jambe_Gauche = new THREE.Mesh(jambe_GaucheGeometry, jambe_GaucheMaterial);
    jambe_Gauche.position.set(1 + x, 0 + y, 0);
    groupe_Steve.add(jambe_Gauche);

    // corps
    var corps = new THREE.Mesh(corpsGeometry, corpsMaterial);
    corps.position.set(0.5 + x, 3.5 + y, 0);
    groupe_Steve.add(corps);

    // tête
    var tete = new THREE.Mesh(teteGeometry, teteMaterial);
    tete.position.set(0 + x, 7 + y, 0);
    groupe_Steve.add(tete);

    // BRAS
    // bras droit
    var bras_Droit = new THREE.Mesh(bras_DroitGeometry, bras_DroitMaterial);
    bras_Droit.position.set(3 + x, 3.5 + y, 0);
    groupe_Steve.add(bras_Droit);

    // bras gauche
    var bras_Gauche = new THREE.Mesh(bras_GaucheGeometry, bras_GaucheMaterial);
    bras_Gauche.position.set(-3 + x, 3.5 + y, 0);
    groupe_Steve.add(bras_Gauche);

}

function ajout_soleil(x,y,forme) {
    if(forme == 0) {
        // texture
        var textureLoader = new THREE.TextureLoader();
        var texture_Soleil = textureLoader.load('images/soleil.png');

        // géométrie et matériaux
        const soleilMaterial = new THREE.MeshBasicMaterial({ map: texture_Soleil });
        const soleilGeometry = new THREE.BoxGeometry(10, 10, 10);

        // création des mesh et ajout comme fils
        // soleil
        var soleil = new THREE.Mesh(soleilGeometry, soleilMaterial);
        soleil.position.set(0 + x, 0 + y, 0);
        groupe_soleil.add(soleil);
    }
    else {
        // géométrie et matériaux
        const soleilMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00});
        const luneMaterial = new THREE.MeshBasicMaterial({ color: 0xbdc4c5})
        const cercleGeometry = new THREE.SphereGeometry(10, 32, 32);

        // création des mesh et ajout comme fils
        // soleil
        var soleil = new THREE.Mesh(cercleGeometry, soleilMaterial);
        soleil.position.set(0 + x, 0 + y, 0);
        groupe_soleil.add(soleil);

        // ajout d'une lune à l'opposer du soleil
        var lune = new THREE.Mesh(cercleGeometry, luneMaterial);
        lune.position.set(0 - x, 0 - y, 0);
        groupe_soleil.add(lune);
    }
    
}