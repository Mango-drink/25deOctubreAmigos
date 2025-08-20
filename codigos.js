
// ===== Base de códigos =====
// display: texto que quieres ver en la lista y en el título
// nombres: (opcional) lista de personas si la quieres mostrar en chips
// invitados: número de lugares asignados
// mensaje: (opcional) mensaje personalizado

const CODIGOS = {
    // Código genérico (no muestra nombres ni cantidad personalizada)
    "INVITADO": {
        generico: true,
        invitados: 0,
        display: "Invitado",
        mensaje: "¡Gracias por acompañarme! Tu presencia es lo más importante para mi. Nos vemos el 25 de octubre"
    },

    // === Familias de ejemplo (ajusta libremente) ===
    "FAM-GASCA": {
        invitados: 3,
        display: "Salvador Rangel Gasca",
        nombres: ["Adulto 1", "Adulto 2", "Adulto 3"],
        mensaje: "¡Salvador Rangel Gasca! Me encantará contar con su compañía. Tienen 3 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-RANGEL01": {
        invitados: 2,
        display: "María de Jesus Rangel",
        nombres: ["Adulto 1", "Adulto 2"],
        mensaje: "¡Hola Madrina! Llego el momento que tanto esperamos, gracias por acompañarme en mi camino, me encantará contar con su compañía siempre, pero en especial este 25 de Octubre. Tienen 2 lugares reservados. Un beso y un abrazo."
    },
    "FAM-SANDOVAL": {
        invitados: 3,
        display: "Sra. Juanita Sandoval",
        nombres: ["Adulto 1", "Adulto 2", "Adulto 3"],
        mensaje: "¡Sra. Juanita Sandoval! Me encantará contar con su compañía. Tienen 3 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-RANGEL02": {
        invitados: 4,
        display: "Eladio Rangel",
        nombres: ["Adulto 1", "Adulto 2", "Adulto 3", "Adulto 4"],
        mensaje: "¡Eladio Rangel! Me encantará contar con su compañía. Tienen 4 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-PEREZ": {
        invitados: 2,
        display: "Andres Pérez",
        nombres: ["Adulto 1", "Adulto 2"],
        mensaje: "¡Andres Pérez! Me encantará contar con su compañía. Tienen 2 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-RIVAS01": {
        invitados: 3,
        display: "Rodolfo Rivas",
        nombres: ["Adulto 1", "Adulto 2", "Adulto 3"],
        mensaje: "¡Padrinos! Me encantará contar con su compañía hoy y siempre pero más en este día tan especial para mi. Tienen 3 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-RIVAS02": {
        invitados: 2,
        display: "Ronaldo Rivas",
        nombres: ["Adulto 1", "Adulto 2"],
        mensaje: "¡Ronaldo Rivas! Me encantará contar con su compañía. Tienen 2 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-MARTINEZ": {
        invitados: 4,
        display: "Arturo Martinez",
        nombres: ["Adulto 1", "Adulto 2", "Niñ@", "Niñ@"],
        mensaje: "¡Arturo Martinez! Me emocionará compartir este día con ustedes. Reservé 4 lugares: 2 adultos y 2 niños. Gracias por ser parte de mi historia."
    },
    "FAM-FRANCO01": {
        invitados: 4,
        display: "Carlos Franco",
        nombres: ["Adulto 1", "Adulto 2", "Adulto 3", "Adulto 4"],
        mensaje: "¡Carlos Franco! Me encantará contar con su compañía. Tienen 4 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-FRANCO02": {
        invitados: 3,
        display: "Carla Franco",
        nombres: ["Adulto 1", "Adulto 2", "Niñ@"],
        mensaje: "¡Carla Franco! Me emocionará compartir este día con ustedes. Reservé 3 lugares: 2 adultos y 1 niño. Gracias por ser parte de mi historia."
    },
    "FAM-MUNOZ": {
        invitados: 6,
        display: "Eduardo Muñoz",
        nombres: ["Adulto 1", "Adulto 2", "Adulto 3", "Adulto 4", "Adulto 5", "Adulto 6"],
        mensaje: "¡Eduardo Muñoz! Me encantará contar con su compañía. Tienen 6 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-ALBARRAN01": {
        invitados: 5,
        display: "Gustavo Albarrán",
        nombres: ["Adulto 1", "Adulto 2", "Adulto 3", "Adulto 4", "Adulto 5"],
        mensaje: "¡Padrinos! Por fin llego el momento de acompañarme, no solo hoy, siempre. Me encantará contar con su compañía. Tienen 5 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-ALBARRAN02": {
        invitados: 2,
        display: "César Albarrán",
        nombres: ["Adulto 1", "Adulto 2"],
        mensaje: "¡Gatito! Cómo pasa el tiempo pero sigues aquí conmigo como el primer día me encantará contar con su compañía. Tienen 2 lugares reservados. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-RANGEL03": {
        invitados: 2,
        display: "Salvador Rangel",
        nombres: ["Adulto 1", "Adulto 2"],
        mensaje: "¡Salvador Rangel! Me encantará contar con su compañía. Tienen 2 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-SANCHEZ": {
        invitados: 5,
        display: "Lucia Sanchez",
        nombres: ["Adulto 1", "Adulto 2", "Adulto 3", "Niñ@", "Niñ@"],
        mensaje: "¡Lucia Sanchez! Me emocionará compartir este día con ustedes. Reservé 5 lugares: 3 adultos y 2 niños. Gracias por ser parte de mi historia."
    },
    "FAM-GUZMAN01": {
        invitados: 3,
        display: "Felipe Guzman",
        nombres: ["Adulto 1", "Adulto 2", "Adulto 3"],
        mensaje: "¡Felipe Guzman! Me encantará contar con su compañía. Tienen 3 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-GUZMAN02": {
        invitados: 2,
        display: "Alicia Guzman",
        nombres: ["Adulto 1", "Adulto 2"],
        mensaje: "¡Alicia Guzman! Me encantará contar con su compañía. Tienen 2 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-GUZMAN03": {
        invitados: 1,
        display: "Monica Guzman",
        nombres: ["Adulto 1"],
        mensaje: "¡Monica Guzman! Me encantará contar con su compañía. Tienen 1 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-RANGEL04": {
        invitados: 3,
        display: "Rodrigo Rangel",
        nombres: ["Adulto 1", "Adulto 2", "Niñ@"],
        mensaje: "¡Neni! Absolutamente gracias por todo el apoyo que me has brindado, llego el día y me emocionará compartir este día con ustedes. Reservé 3 lugares: 2 adultos y 1 niño. Gracias por ser parte de mi historia."
    },
    "FAM-RANGEL05": {
        invitados: 2,
        display: "José Antonio Rangel",
        nombres: ["Adulto 1", "Adulto 2"],
        mensaje: "¡Tari y Lito! Gracias por no dejarme sola en este camino. Me encantará contar con su compañía. Tienen 2 lugares reservados. ¡Nos vemos el 25 de octubre! Los quiero mucho"
    },
    "FAM-FRANCO03": {
        invitados: 3,
        display: "Julio Franco",
        nombres: ["Adulto 1", "Adulto 2", "Adulto 3"],
        mensaje: "¡Julio Franco! Me encantará contar con su compañía. Tienen 3 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-FRANCO04": {
        invitados: 4,
        display: "Yuliana Franco",
        nombres: ["Adulto 1", "Adulto 2", "Adulto 3", "Adulto 4"],
        mensaje: "¡Yuliana Franco! Me encantará contar con su compañía. Tienen 4 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "SRA-LIDIA": {
        invitados: 3,
        display: "Sra. Lidia",
        nombres: ["Adulto 1", "Adulto 2", "Adulto 3"],
        mensaje: "¡Sra. Lidia! Me encantará contar con su compañía. Tienen 3 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-RIVERA": {
        invitados: 4,
        display: "Enrique Rivera",
        nombres: ["Adulto 1", "Adulto 2", "Adulto 3", "Adulto 4"],
        mensaje: "¡Enrique Rivera! Me encantará contar con su compañía. Tienen 4 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-ALFARO": {
        invitados: 4,
        display: "Angelica Alfaro",
        nombres: ["Adulto 1", "Adulto 2", "Adulto 3", "Adulto 4"],
        mensaje: "¡Angelica Alfaro! Me encantará contar con su compañía. Tienen 4 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-GARCIA": {
        invitados: 4,
        display: "Cinthia García",
        nombres: ["Adulto 1", "Adulto 2", "Adulto 3", "Adulto 4"],
        mensaje: "¡Cinthia García! Me encantará contar con su compañía. Tienen 4 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "RITZUKO": {
        invitados: 2,
        display: "Ritzuko",
        nombres: ["Adulto 1", "Adulto 2"],
        mensaje: "¡Ritzuko! Me encantará contar con su compañía. Tienen 2 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-ESLAVA": {
        invitados: 4,
        display: "Juan Eslava",
        nombres: ["Adulto 1", "Adulto 2", "Adulto 3", "Niñ@"],
        mensaje: "¡Juan Eslava! Me emocionará compartir este día con ustedes. Reservé 4 lugares: 3 adultos y 1 niño. Gracias por ser parte de mi historia."
    },
    "FAM-RANGEL06": {
        invitados: 3,
        display: "Marina Rangel",
        nombres: ["Adulto 1", "Adulto 2", "Adulto 3"],
        mensaje: "¡Marina Rangel! Me encantará contar con su compañía. Tienen 3 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-ARENAS": {
        invitados: 6,
        display: "Teresa Arenas",
        nombres: ["Adulto 1", "Adulto 2", "Adulto 3", "Adulto 4", "Adulto 5", "Adulto 6"],
        mensaje: "¡Teresa Arenas! Me encantará contar con su compañía. Tienen 6 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-ARREDONDO01": {
        invitados: 2,
        display: "Angel Arredondo",
        nombres: ["Adulto 1", "Adulto 2"],
        mensaje: "¡Angel Arredondo! Me encantará contar con su compañía. Tienen 2 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
    "FAM-ARREDONDO02": {
        invitados: 4,
        display: "Eduardo Arredondo",
        nombres: ["Adulto 1", "Adulto 2", "Niñ@", "Niñ@"],
        mensaje: "¡Eduardo Arredondo! Me emocionará compartir este día con ustedes. Reservé 4 lugares: 2 adultos y 2 niños. Gracias por ser parte de mi historia."
    },
    "FAM-RANGEL07": {
        invitados: 2,
        display: "Irma Rangel",
        nombres: ["Adulto 1", "Adulto 2"],
        mensaje: "¡Irma Rangel! Me encantará contar con su compañía. Tienen 2 lugares reservados para su familia. ¡Nos vemos el 25 de octubre!"
    },
};

// ===== Helpers reutilizables =====

// 1) Devuelve el nombre que se va a mostrar (display > join(nombres) > fallback)
function nombreParaMostrar(entry) {
    if (!entry) return "Invitados";
    if (entry.display && entry.display.trim()) return entry.display.trim();
    if (Array.isArray(entry.nombres) && entry.nombres.length > 0) {
        // Une con " y " si son 2, o con comas si son más
        return entry.nombres.length === 2
            ? `${entry.nombres[0]} y ${entry.nombres[1]}`
            : entry.nombres.join(", ");
    }
    return "Invitados";
}

// 2) Pluralización simple
function etiquetaInvitados(n) {
    const num = Number(n) || 0;
    return num === 1 ? "1 invitado" : `${num} invitados`;
}

// Expón a window para usarlos en main.js
window.CODIGOS = CODIGOS;
window.nombreParaMostrar = nombreParaMostrar;
window.etiquetaInvitados = etiquetaInvitados;
