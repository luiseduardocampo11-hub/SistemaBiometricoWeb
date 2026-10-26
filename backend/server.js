
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const {
    validarEmpleado,
    validarAsistencia
} = require("./validaciones");

const app = express();
const PORT = process.env.PORT || 3000;
const cliente = new MongoClient(process.env.MONGODB_URI);

app.use(cors());
app.use(express.json());

let empleados;
let asistencias;

// Ruta principal
app.get("/", (req, res) => {
    res.json({
        mensaje: "Sistema Biométrico Facial",
        estado: "Servidor funcionando"
    });
});


// Comprobar servidor y base de datos
app.get("/api/salud", (req, res) => {
    res.json({
        servidor: "activo",
        baseDeDatos: empleados ? "conectada" : "desconectada"
    });
});

// Consultar empleados
app.get("/api/empleados", async (req, res) => {
    try {
        const lista = await empleados.find({}).toArray();
        res.json(lista);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "No se pudieron consultar los empleados"
        });
    }
});

// Registrar empleado
app.post("/api/empleados", async (req, res) => {
    try {
        const { nombre, documento, cargo } = req.body;

        if (
    typeof nombre !== "string" ||
    !nombre.trim() ||
    typeof documento !== "string" ||
    !documento.trim() ||
    typeof cargo !== "string" ||
    !cargo.trim()
) {
    return res.status(400).json({
        mensaje: "Nombre, documento y cargo son obligatorios"
    });
}

        const empleado = {
            nombre: nombre.trim(),
            documento: documento.trim(),
            cargo: cargo.trim(),
            creadoEn: new Date()
        };

        const existente = await empleados.findOne({
            documento: empleado.documento
        });

        if (existente) {
            return res.status(409).json({
                mensaje: "Ya existe un empleado con ese documento"
            });
        }

        const resultado = await empleados.insertOne(empleado);

        res.status(201).json({
            mensaje: "Empleado registrado correctamente",
            id: resultado.insertedId,
            empleado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "Error al registrar el empleado"
        });
    }
});

/* CONSULTAR HISTORIAL DE ASISTENCIAS */
app.get("/api/asistencias", async (req, res) => {
    try {
        const historial = await asistencias
            .find({})
            .sort({ fechaHora: -1 })
            .limit(100)
            .toArray();

        res.json(historial);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "No se pudo consultar el historial"
        });
    }
});

/* REGISTRAR ENTRADA O SALIDA */
app.post("/api/asistencias", async (req, res) => {
    try {
        const { documento, tipo } = req.body;

        const errorValidacion = validarAsistencia({
    documento,
    tipo
});

if (errorValidacion) {
    return res.status(400).json({
        mensaje: errorValidacion
    });
} {
            return res.status(400).json({
                mensaje: "Documento y tipo de asistencia son obligatorios"
            });
        }

        const empleado = await empleados.findOne({
            documento: documento.trim()
        });

        if (!empleado) {
            return res.status(404).json({
                mensaje: "El empleado no está registrado"
            });
        }

        const ultima = await asistencias.findOne(
            { documento: empleado.documento },
            { sort: { fechaHora: -1 } }
        );

        if (tipo === "Entrada" && ultima?.tipo === "Entrada") {
            return res.status(409).json({
                mensaje: "Ya existe una entrada sin una salida registrada"
            });
        }

        if (tipo === "Salida" && (!ultima || ultima.tipo !== "Entrada")) {
            return res.status(409).json({
                mensaje: "Debe registrar una entrada antes de la salida"
            });
        }

        const asistencia = {
            documento: empleado.documento,
            nombre: empleado.nombre,
            tipo,
            fechaHora: new Date()
        };

        await asistencias.insertOne(asistencia);

        res.status(201).json({
            mensaje: `${tipo} registrada correctamente`,
            asistencia
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: "No se pudo registrar la asistencia"
        });
    }
});

async function iniciarServidor() {
    try {
        await cliente.connect();

        const db = cliente.db(
            process.env.DB_NAME || "sistema_biometrico_facial"
        );

        empleados = db.collection("empleados");
        asistencias = db.collection("asistencias");

await asistencias.createIndex({
    documento: 1,
    fechaHora: -1
});

        await empleados.createIndex(
            { documento: 1 },
            { unique: true }
        );

        app.listen(PORT, () => {
            console.log(
                `Servidor ejecutándose en http://localhost:${PORT}`
            );
            console.log("MongoDB conectado correctamente");
        });
    } catch (error) {
        console.error("No fue posible iniciar la aplicación:", error.message);
        process.exit(1);
    }
}

iniciarServidor();
