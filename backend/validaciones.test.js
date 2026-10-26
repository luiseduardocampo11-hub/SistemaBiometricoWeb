const test = require("node:test");
const assert = require("node:assert/strict");

const {
    validarEmpleado,
    validarAsistencia
} = require("./validaciones");

// Pruebas del módulo de empleados

test("Debe aceptar un empleado con todos los datos", () => {
    const resultado = validarEmpleado({
        nombre: "Carlos Pérez",
        documento: "123456789",
        cargo: "Operario"
    });

    assert.equal(resultado, null);
});

test("Debe rechazar un empleado sin nombre", () => {
    const resultado = validarEmpleado({
        nombre: "",
        documento: "123456789",
        cargo: "Operario"
    });

    assert.equal(
        resultado,
        "Nombre, documento y cargo son obligatorios"
    );
});

test("Debe rechazar un documento vacío", () => {
    const resultado = validarEmpleado({
        nombre: "Carlos Pérez",
        documento: " ",
        cargo: "Operario"
    });

    assert.notEqual(resultado, null);
});

// Pruebas del módulo de asistencias

test("Debe aceptar una entrada válida", () => {
    const resultado = validarAsistencia({
        documento: "123456789",
        tipo: "Entrada"
    });

    assert.equal(resultado, null);
});

test("Debe aceptar una salida válida", () => {
    const resultado = validarAsistencia({
        documento: "123456789",
        tipo: "Salida"
    });

    assert.equal(resultado, null);
});

test("Debe rechazar un tipo de asistencia no permitido", () => {
    const resultado = validarAsistencia({
        documento: "123456789",
        tipo: "Descanso"
    });

    assert.notEqual(resultado, null);
});

test("Debe rechazar una asistencia sin documento", () => {
    const resultado = validarAsistencia({
        documento: "",
        tipo: "Entrada"
    });

    assert.notEqual(resultado, null);
});test("Debe rechazar un nombre compuesto solo por espacios", () => {
    const resultado = validarEmpleado({
        nombre: "   ",
        documento: "123456789",
        cargo: "Operario"
    });

    assert.notEqual(resultado, null);
});

test("Debe rechazar un documento que no sea texto", () => {
    const resultado = validarEmpleado({
        nombre: "Carlos Pérez",
        documento: 123456789,
        cargo: "Operario"
    });

    assert.notEqual(resultado, null);
});

test("Debe rechazar un tipo de asistencia escrito incorrectamente", () => {
    const resultado = validarAsistencia({
        documento: "123456789",
        tipo: "entrada"
    });

    assert.notEqual(resultado, null);
});