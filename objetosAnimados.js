export function prepararObjetosAnimados(objetos) {

    if (objetos.length === 0) {
        console.warn("No se encontraron objetos animados");
        return;
    }

    objetos.forEach((objeto) => {
        objeto.userData.girando = true;
    });

    console.log("Objetos preparados:", objetos);
}
const ejesObjetos = {
    "Tocadisco": "z",
    "Telefono": "z",
    "Cofre": "y",
    "Jarra": "y",
    "Cuadro1": "z",
    "Cuadro2": "z",
    "Estaño": "z",
    "SiilaDeRuedas": "z"
};
export function animarObjetos(objetos) {

    objetos.forEach((objeto) => {

        const eje = ejesObjetos[objeto.name] || "y";

        if (eje === "y") {
            objeto.rotation.y += 0.01;
        }

        if (eje === "z") {
            objeto.rotation.z += 0.01;
        }

    });

}