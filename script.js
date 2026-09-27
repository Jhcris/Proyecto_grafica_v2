import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { crearInteraccionObjetos } from './objetosInteraccion.js';
import {prepararObjetosAnimados,animarObjetos} from './objetosAnimados.js';
import { CSS3DRenderer, CSS3DObject }
from 'three/addons/renderers/CSS3DRenderer.js';
const scene = new THREE.Scene();
/// Inicio Cienlo
// ==========================================
// CIELO
// ==========================================

const canvasCielo = document.createElement("canvas");

canvasCielo.width = 2;
canvasCielo.height = 512;

const contexto = canvasCielo.getContext("2d");

const texturaCielo = new THREE.CanvasTexture(canvasCielo);

scene.background = texturaCielo;


// ==========================================
// CAMBIAR CIELO
// ==========================================

function cambiarCielo(colores) {

    const degradado = contexto.createLinearGradient(
        0,
        0,
        0,
        canvasCielo.height
    );

    // Parte superior
    degradado.addColorStop(
        0,
        colores.arriba
    );

    // Parte media
    degradado.addColorStop(
        0.5,
        colores.centro
    );

    // Horizonte
    degradado.addColorStop(
        1,
        colores.horizonte
    );

    contexto.fillStyle = degradado;

    contexto.fillRect(
        0,
        0,
        canvasCielo.width,
        canvasCielo.height
    );

    texturaCielo.needsUpdate = true;
}
// ==========================================
// SISTEMA DE TIEMPO
// ==========================================

const ambientes = {

    dia: {

        posicion: new THREE.Vector3(140, 87, 5),

        colorLuz: 0xfff2cc,
        intensidad: 4,

        colorAmbiental: 0xcfe8ff,
        intensidadAmbiental: 1.1,

        nubes: true,

        colorSol: 0xfff2cc,
        escalaSol: 1,

        cielo: {
            arriba: "#2d3973",
            centro: "#325a89",
            horizonte: "#A9D4F7"
        }

    },


    atardecer: {

        posicion: new THREE.Vector3(-41, 87, -218),

        colorLuz: 0xffa54d,
        intensidad: 3.5,

        colorAmbiental: 0xffb47d,
        intensidadAmbiental: 0.8,

        nubes: true,

        colorSol: 0xff9440,
        escalaSol: 1.2,

        cielo: {
            arriba: "#3b2140",
            centro: "#b05b4f",
            horizonte: "#ffb36b"
        }

    },


    noche: {

        posicion: new THREE.Vector3(-140, 87, 5),

        colorLuz: 0xbfd6ff,
        intensidad: 0.9,

        colorAmbiental: 0x1d2748,
        intensidadAmbiental: 0.25,

        nubes: false,

        colorSol: 0xe8f3ff,
        escalaSol: 0.7,

        cielo: {
            arriba: "#030611",
            centro: "#07152d",
            horizonte: "#132548"
        }

    }

};


// ==========================================
// CAMBIAR CIELO
// ==========================================




// ==========================================
// CAMBIAR AMBIENTE
// ==========================================

function cambiarAmbiente(ambiente) {

    // Cambiar posición de la luz del sol
    luzSol.position.copy(
        ambiente.posicion
    );


    // Cambiar posición visual del sol
    sol.position.copy(
        ambiente.posicion
    );


    // Cambiar luz del sol
    luzSol.color.setHex(
        ambiente.colorLuz
    );

    luzSol.intensity =
        ambiente.intensidad;


    // Cambiar luz ambiental
    luzAmbiente.color.setHex(
        ambiente.colorAmbiental
    );

    luzAmbiente.intensity =
        ambiente.intensidadAmbiental;


    // Cambiar color del sol
    sol.material.color.setHex(
        ambiente.colorSol
    );


    // Cambiar tamaño del sol
    sol.scale.set(
        ambiente.escalaSol,
        ambiente.escalaSol,
        ambiente.escalaSol
    );


    // Cambiar cielo
    cambiarCielo(
        ambiente.cielo
    );


    // Mostrar / ocultar nubes
    if (typeof nubes !== "undefined") {

        nubes.forEach((nube) => {

            nube.mesh.visible =
                ambiente.nubes;

        });

    }

}


// ==========================================
// BOTONES DE TIEMPO
// ==========================================

const btnDia =
    document.getElementById("btnDia");

const btnAtardecer =
    document.getElementById("btnAtardecer");

const btnNoche =
    document.getElementById("btnNoche");


btnDia.addEventListener("click", () => {

    cambiarAmbiente(
        ambientes.dia
    );

});


btnAtardecer.addEventListener("click", () => {

    cambiarAmbiente(
        ambientes.atardecer
    );

});


btnNoche.addEventListener("click", () => {

    cambiarAmbiente(
        ambientes.noche
    );

});
// ==========================================
// AMBIENTE INICIAL
// ==========================================

cambiarCielo(
    ambientes.dia.cielo
);
//Nubes
const textureLoader = new THREE.TextureLoader();
const texturaNube = textureLoader.load("Imagenes/Nubes.png");
const materialNube = new THREE.MeshBasicMaterial({
    map: texturaNube,
    transparent: true,
    depthWrite: false
});
const nubes = [];
for (let i = 0; i < 80; i++) {
    const nube = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 10),
        materialNube.clone()
    );
    nube.position.set(Math.random() * 350 - 200,80 + Math.random() * 15,Math.random() * 500 - 200);
    // Tamaño diferente para cada nube
    const escala = 0.8 + Math.random() * 1.8;
    nube.scale.set(
        escala,
        escala,
        escala
    );
    scene.add(nube);
    nubes.push({
        mesh: nube,
        velocidad: 0.005 + Math.random() * 0.01
    });
}
//Fin nubes

const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000);

camera.position.set(36.21, 33.10, -163.00);
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.body.appendChild(renderer.domElement);
// =========================================
// RENDERER 3D PARA ELEMENTOS HTML
// =========================================

const cssRenderer = new CSS3DRenderer();

cssRenderer.setSize(
    window.innerWidth,
    window.innerHeight
);

cssRenderer.domElement.style.position = "fixed";
cssRenderer.domElement.style.top = "0";
cssRenderer.domElement.style.left = "0";

cssRenderer.domElement.style.pointerEvents = "none";

document.body.appendChild(cssRenderer.domElement);
// =========================================
// VIDEO DE YOUTUBE DENTRO DEL MUNDO 3D
// =========================================

const elementoVideo =
    document.getElementById("videoYoutube3D");

const video3D =
    new CSS3DObject(elementoVideo);

// POSICIÓN DEL VIDEO
// Estas son las coordenadas que tú puedes modificar.

video3D.position.set(
    -70,
    9,
    91
);
//video3D.rotation.y = Math.PI / 2;
// TAMAÑO DEL VIDEO
video3D.scale.set(
    0.02,
    0.02,
    0.01
);

// Agregarlo a la escena
scene.add(video3D);
video3D.visible = false;

    // ==========================
    // CONTROLES
    // ==========================
    const controls = new OrbitControls(
        camera,
        renderer.domElement
    );
    controls.enableDamping = true;
    controls.enabled = false;
    controls.enableRotate = true;
    // Desactivar zoom con la rueda del mouse
    controls.enableZoom = false;
    // Desactivar desplazamiento lateral
    controls.enablePan = false;
    const posicionInicial = camera.position.clone();
    // Guardar punto inicial hacia donde mira la cámara
    const objetivoInicial = controls.target.clone();

// LUCES
const luzAmbiente = new THREE.AmbientLight(
    0xffffff,
    2
);
scene.add(luzAmbiente);
const luzDireccional = new THREE.DirectionalLight(
    0xffffff,
    3
);
luzDireccional.position.set(10, 15, 10);
scene.add(luzDireccional);
renderer.shadowMap.enabled = true;

// SOL
const geometriaSol = new THREE.SphereGeometry(8,32,32);
const materialSol = new THREE.MeshBasicMaterial({color: 0xffdd66});
const sol = new THREE.Mesh(
geometriaSol,
materialSol
);
// Posición del sol
sol.position.set(112.33,180.29,237.94);
scene.add(sol);

// LUZ DEL SOL
const luzSol = new THREE.DirectionalLight(0xfffff0,0.5);
// Misma posición que el sol
luzSol.position.set(112.33,81.29,237.94);
// Activar sombras
luzSol.castShadow = true;
scene.add(luzSol);

// CARGAR CASA
let objetosAnimados = [];
let actualizarInteraccionObjetos = () => {};
const loader = new GLTFLoader();


loader.load(
    "Casa_Simon_Oficial.glb",
    function(gltf) {
        const casa = gltf.scene;
        
casa.position.set(0, 0, 0);
// Activar sombras en todos los objetos de la casa
casa.traverse(function(objeto) {
if (objeto.isMesh) {
    objeto.castShadow = true;
    objeto.receiveShadow = true;
}
});
scene.add(casa);
objetosAnimados = [];

casa.traverse((objeto) => {

    if (
        objeto.name === "Tocadisco" ||
        objeto.name === "Telefono" ||
        objeto.name === "Cofre" ||
        objeto.name === "Jarra" ||
        objeto.name === "Cuadro1" ||
        objeto.name === "Cuadro2" ||
        objeto.name === "Estaño" ||
        objeto.name === "SiilaDeRuedas" 
    ) {
        objetosAnimados.push(objeto);
    }

});

prepararObjetosAnimados(objetosAnimados);
    actualizarInteraccionObjetos = crearInteraccionObjetos(objetosAnimados,camera,renderer);
        console.log("Interacción de objetos activada");
        console.log("Casa cargada correctamente");
    },
    function(xhr) {
        console.log(
            (xhr.loaded / xhr.total * 100) + "% cargado"
        );
    },
    function(error) {
        console.error(
            "Error al cargar la casa:",
            error
        );
    }
);
window.addEventListener("resize", () => {   
    camera.aspect =
        window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
    cssRenderer.setSize(
    window.innerWidth,
    window.innerHeight
);
});

const coordenadas = document.getElementById("coordenadas");

// BOTONES
const btnEntorno =
    document.getElementById("btnEntorno");
const btnSalirVista =
    document.getElementById("btnSalirVista");
const presentacion =
    document.getElementById("presentacion");
const botonesPrincipales =
    document.getElementById("botonesPrincipales");
const ayudaMovimiento =
    document.getElementById("ayudaMovimiento");
const btnVerObj =
    document.getElementById("btnObjetos");
const btnSalir =
    document.getElementById("btnSalir");
const flechasHabitacion =
    document.getElementById("flechasHabitacion");
const flechaIzquierda =
    document.getElementById("flechaIzquierda");
const flechaDerecha =
    document.getElementById("flechaDerecha");
const btnGaleria =
    document.getElementById("btnGaleria");
const btnHistoria =
    document.getElementById("btnHistoria");

// ACTIVAR MODO VISTA
btnEntorno.addEventListener("click", () => {
    // Activar movimiento de cámara
    controls.enabled = true;
    // Ocultar presentación
    presentacion.style.display = "none";
    // Ocultar botones principales
    botonesPrincipales.style.display = "none";
    // Mostrar botón de salir
    btnSalirVista.style.display = "block";
    ayudaMovimiento.style.display = "block";

// SALIR DEL MODO VISTA
btnSalirVista.addEventListener("click", () => {
    // Desactivar controles
    controls.enabled = false;
    // Volver a la posición inicial
    camera.position.copy(posicionInicial);
    // Volver a mirar al punto inicial
    controls.target.copy(objetivoInicial);
    controls.update();
    // Mostrar presentación
    presentacion.style.display = "block";
    // Mostrar botones principales
    botonesPrincipales.style.display = "flex";
    // Ocultar botón salir
    btnSalirVista.style.display = "none";
    ayudaMovimiento.style.display = "none";
    });
    

});

// ACTIVAR MODO VISTA OBJETOS
btnVerObj.addEventListener("click", () => {
    puntoActual = 0;
    progreso = 0;

    // Iniciar recorrido automático
    animandoObjetos = true;
    animandoRegreso = false;
    modoHabitacion = false;
    flechasHabitacion.style.display = "none";
    // Desactivar controles durante el recorrido
    controls.enabled = false;

    // Ocultar presentación
    presentacion.style.display = "none";

    // Ocultar botones principales
    botonesPrincipales.style.display = "none";

    // OCULTAR SALIR mientras la cámara viaja
    btnSalir.style.display = "block";

    ayudaMovimiento.style.display = "none";

// SALIR DEL MODO VISTA OBJETOS
btnSalir.addEventListener("click", () => {
    modoHabitacion = false;
    video3D.visible = false;
    flechasHabitacion.style.display = "none";
    // Empezar desde el último punto
    puntoActual = caminoObjetos.length - 1;

    // Reiniciar progreso
    progreso = 0;

    // Activar recorrido de regreso
    animandoRegreso = true;

    // Desactivar recorrido de ida
    animandoObjetos = false;

    // Ocultar botón mientras regresa
    btnSalir.style.display = "none";

    ayudaMovimiento.style.display = "none";
    });
    

});

btnGaleria.addEventListener("click", () => {
    window.location.href = "galeria.html";
});
btnHistoria.addEventListener("click", () => {
    window.location.href = "Historia.html";
});

// ==========================
// CAMINO HACIA LOS OBJETOS
const caminoObjetos = [
    // PUNTO 0 - POSICIÓN INICIAL
    {
        posicion: new THREE.Vector3(
            camera.position.x,
            camera.position.y,
            camera.position.z
        ),
        mirar: new THREE.Vector3(20, 8, 0)
    },
    // PUNTO 1
    {
        posicion: new THREE.Vector3(6.66,8.09,-110.67),
        mirar: new THREE.Vector3(0, 0, 0)
    },
    {
        posicion: new THREE.Vector3(6.66,8.09,99),
        mirar: new THREE.Vector3(-150, 0, 150)
    },
    {
        posicion: new THREE.Vector3(-72,8,100),
        mirar: new THREE.Vector3(-1000, 0, 0),
    },
    {
        posicion: new THREE.Vector3(-69,8,110),
        mirar: new THREE.Vector3(-1000, 0, 0),
        mirarFinal: new THREE.Vector3(-1900, 8, -50)
    },

];

let puntoActual = 0;
let progreso = 0;
let velocidad = 0.009;

let animandoObjetos = false;
let animandoRegreso = false;
// =================================
// GIRO EN LA HABITACIÓN
// =================================
let modoHabitacion = false;
let giroCamara = 0;
let velocidadGiro = 0.01;
let posicionMouseX = 0;
window.addEventListener("mousemove", (evento) => {
    posicionMouseX = evento.clientX;

});
const btnObjetos = document.getElementById("btnObjetos");
btnObjetos.addEventListener("click", () => {
    // Reiniciar recorrido
    puntoActual = 0;
    progreso = 0;
    // Iniciar recorrido
    animandoObjetos = true;
});

const objetivoMirada = new THREE.Vector3();

// =========================================
// MÚSICA DE FONDO
// =========================================

const musicaFondo = document.getElementById("musicaFondo");
const btnMusica = document.getElementById("btnMusica");
const volumenMusica = document.getElementById("volumenMusica");

// Volumen inicial
musicaFondo.volume = 0.5;

// Reproducir música después de la primera interacción
function iniciarMusica() {

    musicaFondo.play().catch(() => {
        console.log("El navegador bloqueó el autoplay.");
    });

    document.removeEventListener("click", iniciarMusica);
}

document.addEventListener("click", iniciarMusica);


// Botón mute / activar
btnMusica.addEventListener("click", (evento) => {

    evento.stopPropagation();

    musicaFondo.muted = !musicaFondo.muted;

    if (musicaFondo.muted) {
        btnMusica.textContent = "🔇";
    } else {
        btnMusica.textContent = "🔊";
    }
});


// Control de volumen
volumenMusica.addEventListener("input", (evento) => {

    musicaFondo.volume = evento.target.value;

    // Si sube el volumen, quitamos mute
    if (musicaFondo.volume > 0) {
        musicaFondo.muted = false;
        btnMusica.textContent = "🔊";
    }
});

//Funcion ANIMATE//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function animate() {
    requestAnimationFrame(animate);
    animarObjetos(objetosAnimados);
    actualizarInteraccionObjetos();
    
    if (!animandoObjetos && !animandoRegreso && !modoHabitacion) {
    controls.update();
}
    if (camera.position.y < 8) {
    camera.position.y = 8;
    }
    //Animacion nubes
    nubes.forEach((nube) => {
    // Siempre mira hacia la cámara
        nube.mesh.lookAt(camera.position);
        // Movimiento
        nube.mesh.position.x += nube.velocidad;
        // Cuando sale del escenario,
        // vuelve al otro lado
        if (nube.mesh.position.x > 100) {
            nube.mesh.position.x =  -300;
            // Nueva posición aleatoria en Z
            nube.mesh.position.z =
            Math.random() * 200 + 150;
        // Nueva altura aleatoria en Y
            nube.mesh.position.y =
            80 + Math.random() * 15;
        }
    });
    //Fin animacion nubes
    //Coordenadas
    coordenadas.textContent =
        "X: " + camera.position.x.toFixed(2) +
        " | Y: " + camera.position.y.toFixed(2) +
        " | Z: " + camera.position.z.toFixed(2);
    //Fin coordenadas

////////////////////////////////////////////////////////
    if (animandoObjetos) {
    const puntoInicio = caminoObjetos[puntoActual].posicion;
    const puntoFinal = caminoObjetos[puntoActual + 1].posicion;
    progreso += velocidad;
    camera.position.lerpVectors(
        puntoInicio,
        puntoFinal,
        progreso
    );
    // MIRADA
    const mirarHacia = caminoObjetos[puntoActual + 1].mirar;
    camera.lookAt(mirarHacia);
    if (progreso >= 1) {
        progreso = 0;
        puntoActual++;
       if (puntoActual >= caminoObjetos.length - 1) {
    // Guardar la orientación inicial
    // de la cámara en la habitación
    giroCamara = camera.rotation.y;
    // Activar modo habitación
    modoHabitacion = true;
    video3D.visible = true;
    // Mostrar flechas
    flechasHabitacion.style.display = "flex";
    // Mostrar botón Salir
    btnSalir.style.display = "block";
    animandoObjetos = false;
    console.log("Recorrido terminado");
}
    }
}
///////////////////////////////////////////////////////////
    // ==========================================
// RECORRIDO DE REGRESO
// ==========================================

if (animandoRegreso) {
    const puntoInicio =
        caminoObjetos[puntoActual].posicion;
    const puntoFinal =
        caminoObjetos[puntoActual - 1].posicion;
    progreso += velocidad;
    // Mover cámara hacia atrás
    camera.position.lerpVectors(
        puntoInicio,
        puntoFinal,
        progreso
    );

    // Mirar hacia el punto anterior
    const mirarHacia =
        caminoObjetos[puntoActual - 1].mirar;

    camera.lookAt(mirarHacia);

    // Terminó este tramo
    if (progreso >= 1) {

        progreso = 0;

        puntoActual--;

        // ==================================
        // LLEGÓ AL INICIO
        // ==================================

        if (puntoActual <= 0) {

            animandoRegreso = false;

            // Posición inicial exacta
            camera.position.copy(
                caminoObjetos[0].posicion
            );

            // Mirada inicial
            camera.lookAt(
                caminoObjetos[0].mirar
            );

            // Preparar OrbitControls
            controls.target.copy(
                caminoObjetos[0].mirar
            );

            controls.enabled = false;

            // ==================================
            // MOSTRAR INTERFAZ NUEVAMENTE
            // ==================================

            presentacion.style.display = "block";

            botonesPrincipales.style.display = "flex";

            btnSalir.style.display = "none";

            ayudaMovimiento.style.display = "none";

            console.log("Regreso terminado");
        }
    }
}
 girarHabitacion();



    renderer.render(scene, camera);
    cssRenderer.render(scene, camera);
}
animate();
function girarHabitacion() {

    if (!modoHabitacion) {
        return;
    }
    const anchoPantalla = window.innerWidth;
    // Cursor en la parte izquierda
    if (posicionMouseX < anchoPantalla * 0.30) {
        giroCamara += velocidadGiro;
    }
    // Cursor en la parte derecha
    if (posicionMouseX > anchoPantalla * 0.70) {
        giroCamara -= velocidadGiro;

    }

    camera.rotation.y = giroCamara;

}