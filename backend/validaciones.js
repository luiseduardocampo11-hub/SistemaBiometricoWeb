// Validaciones para el Sistema Biométrico Facial

function validarEmpleado({ nombre, documento, cargo } = {}) {
    if (
        typeof nombre !== "string" ||
        !nombre.trim() ||
        typeof documento !== "string" ||
        !documento.trim() ||
        typeof cargo !== "string" ||
        !cargo.trim()
    ) {
        return "Nombre, documento y cargo son obligatorios";
    }

    return null;
}

function validarAsistencia({ documento, tipo } = {}) {
    if (
        typeof documento !== "string" ||
        !documento.trim() ||
        !["Entrada", "Salida"].includes(tipo)
    ) {
        return "Documento y tipo de asistencia son obligatorios";
    }

    return null;
}

module.exports = {
    validarEmpleado,
    validarAsistencia
};