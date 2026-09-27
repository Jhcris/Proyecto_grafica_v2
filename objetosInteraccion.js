import * as THREE from 'three';
const informacionObjetos = {
    "Tocadisco": {
        titulo: "Tocadiscos",
        texto: "Objeto utilizado para reproducir discos de vinilo. Representa parte de la tecnología y los elementos de entretenimiento de una época pasada."
    },

    "Telefono": {
        titulo: "Teléfono",
        texto: "Teléfono de época utilizado para la comunicación a distancia. Este tipo de aparato forma parte de los objetos tecnológicos característicos de su tiempo."
    },

    "Cofre": {
        titulo: "Cofre",
        texto: "Objeto utilizado para guardar y proteger diferentes pertenencias, documentos u objetos de valor."
    },

    "Jarra": {
        titulo: "Jarra",
        texto: "Objeto utilizado para contener y servir líquidos. Forma parte de los elementos domésticos presentes en la casa."
    },

    "Cuadro1": {
        titulo: "Cuadro",
        texto: "Elemento decorativo que forma parte del ambiente interior de la Casa Patiño."
    },

    "Cuadro2": {
        titulo: "Cuadro",
        texto: "Elemento decorativo que forma parte del ambiente interior de la Casa Patiño."
    },

    "Estaño": {
        titulo: "Estaño",
        texto: "El estaño representa uno de los elementos más importantes relacionados con la historia minera de la región y con la actividad económica vinculada a Simón I. Patiño."
    },

    "SiilaDeRuedas": {
        titulo: "Silla de ruedas",
        texto: "Objeto presente en la recreación del ambiente de la casa y que forma parte de los elementos que pueden observarse durante el recorrido."
    }

};


// ==========================================
// CONFIGURACIÓN DE INTERACCIÓN
// ==========================================

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let objetoSeleccionado = null;
let objetoHover = null;


// ==========================================
// CREAR BORDE BLANCO
// ==========================================

function crearBorde(objeto) {

    const bordes = [];

    objeto.traverse((parte) => {

        if (parte.isMesh && parte.geometry) {

            const geometriaBorde = new THREE.EdgesGeometry(
                parte.geometry,
                20
            );

            const materialBorde = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 1
            });

            const borde = new THREE.LineSegments(
                geometriaBorde,
                materialBorde
            );

            borde.visible = false;

            parte.add(borde);

            bordes.push(borde);
        }

    });

    objeto.userData.bordesInteraccion = bordes;
}


// ==========================================
// MOSTRAR / OCULTAR BORDE
// ==========================================

function mostrarBorde(objeto) {

    if (!objeto || !objeto.userData.bordesInteraccion) {
        return;
    }

    objeto.userData.bordesInteraccion.forEach((borde) => {
        borde.visible = true;
    });
}


function ocultarBorde(objeto) {

    if (!objeto || !objeto.userData.bordesInteraccion) {
        return;
    }

    objeto.userData.bordesInteraccion.forEach((borde) => {
        borde.visible = false;
    });
}


// ==========================================
// ENCONTRAR EL OBJETO PRINCIPAL
// ==========================================

function obtenerObjetoPrincipal(parte, objetos) {

    let actual = parte;

    while (actual) {

        if (objetos.includes(actual)) {
            return actual;
        }

        actual = actual.parent;
    }

    return null;
}


// ==========================================
// ACTUALIZAR HOVER
// ==========================================

function actualizarHover(objetos, renderer, camera) {

    raycaster.setFromCamera(mouse, camera);

    const intersecciones = raycaster.intersectObjects(
        objetos,
        true
    );

    let nuevoObjeto = null;

    for (const interseccion of intersecciones) {

        if (!interseccion.object.isMesh) {
            continue;
        }

        nuevoObjeto = obtenerObjetoPrincipal(
            interseccion.object,
            objetos
        );

        if (nuevoObjeto) {
            break;
        }
    }


    // Si cambió el objeto
    if (nuevoObjeto !== objetoHover) {

        // Quitar borde del anterior
        if (objetoHover) {
            ocultarBorde(objetoHover);
        }

        // Mostrar borde del nuevo
        if (nuevoObjeto) {
            mostrarBorde(nuevoObjeto);
            renderer.domElement.style.cursor = "pointer";
        } else {
            renderer.domElement.style.cursor = "default";
        }

        objetoHover = nuevoObjeto;
    }
}


// ==========================================
// CLICK SOBRE OBJETO
// ==========================================

function seleccionarObjeto(objetos, camera) {

    raycaster.setFromCamera(mouse, camera);

    const intersecciones = raycaster.intersectObjects(
        objetos,
        true
    );

    for (const interseccion of intersecciones) {

        if (!interseccion.object.isMesh) {
            continue;
        }

        const objeto = obtenerObjetoPrincipal(
            interseccion.object,
            objetos
        );

        if (!objeto) {
            continue;
        }

        mostrarInformacion(objeto);
        break;
    }
}


// ==========================================
// VENTANA DE INFORMACIÓN
// ==========================================

function mostrarInformacion(objeto) {

    const informacion = informacionObjetos[objeto.name];

    if (!informacion) {
        console.log("No hay información para:", objeto.name);
        return;
    }

    const ventana = document.getElementById("ventanaObjeto");
    const titulo = document.getElementById("tituloObjeto");
    const texto = document.getElementById("textoObjeto");

    titulo.textContent = informacion.titulo;
    texto.textContent = informacion.texto;

    ventana.style.display = "block";

    objetoSeleccionado = objeto;
}


// ==========================================
// CERRAR VENTANA
// ==========================================

function cerrarInformacion() {

    const ventana = document.getElementById("ventanaObjeto");

    ventana.style.display = "none";

    objetoSeleccionado = null;
}


// ==========================================
// FUNCIÓN PRINCIPAL
// ==========================================

export function crearInteraccionObjetos(
    objetos,
    camera,
    renderer
) {

    if (!objetos || objetos.length === 0) {
        console.warn("No hay objetos para interactuar.");
        return function () {};
    }


    // Crear bordes para todos los objetos
    objetos.forEach((objeto) => {
        crearBorde(objeto);
    });


    // ------------------------------------------
    // MOVIMIENTO DEL MOUSE
    // ------------------------------------------

    renderer.domElement.addEventListener(
        "mousemove",
        (evento) => {

            mouse.x =
                (evento.clientX / window.innerWidth) * 2 - 1;

            mouse.y =
                -(evento.clientY / window.innerHeight) * 2 + 1;
        }
    );


    // ------------------------------------------
    // CLICK
    // ------------------------------------------

    renderer.domElement.addEventListener(
    "click",
    () => {

        const ventana = document.getElementById("ventanaObjeto");

        // Si la ventana está abierta,
        // no seleccionar otro objeto
        if (ventana.style.display === "block") {
            return;
        }

        seleccionarObjeto(
            objetos,
            camera
        );

    }
);


    // ------------------------------------------
    // BOTÓN CERRAR
    // ------------------------------------------

    const botonCerrar =
    document.getElementById("cerrarVentanaObjeto");

if (botonCerrar) {

    botonCerrar.addEventListener(
        "click",
        (evento) => {

            evento.stopPropagation();

            cerrarInformacion();

        }
    );

}


    // ------------------------------------------
    // FUNCIÓN QUE SE EJECUTA EN ANIMATE()
    // ------------------------------------------

    return function actualizarInteraccion() {

        actualizarHover(
            objetos,
            renderer,
            camera
        );

    };

}