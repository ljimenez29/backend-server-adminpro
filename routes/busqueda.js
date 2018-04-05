var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// ========================================
// BUSQUEDA POR COLECCIÓN (TABLAS)
// ========================================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var exprreg = new RegExp(busqueda, 'i');
    var tabla = req.params.tabla;
    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, exprreg);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, exprreg);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, exprreg);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los parametros de busquesa solo son: usuarios, medicos y hospitales',
                error: { message: 'Parametro de busqueda no valido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data

        });

    });

});



// ========================================
// FIN BUSQUEDA POR COLECCIÓN (TABLAS)
// ========================================






// ========================================
// BUSQUEDA GENERAL
// ========================================

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var exprreg = new RegExp(busqueda, 'i');

    Promise.all([
        buscarHospitales(busqueda, exprreg),
        buscarMedicos(busqueda, exprreg),
        buscarUsuarios(busqueda, exprreg)
    ]).then(respuestas => {

        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });

    });


});

function buscarHospitales(busqueda, exprreg) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: exprreg })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {

                    reject('Error al cargar hospitales', err);

                } else {

                    resolve(hospitales);
                }

            });

    });

}



function buscarMedicos(busqueda, exprreg) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: exprreg })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {

                    reject('Error al cargar medicos', err);

                } else {

                    resolve(medicos);
                }

            });

    });

}


function buscarUsuarios(busqueda, exprreg) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': exprreg }, { 'email': exprreg }])
            .exec((err, usuarios) => {

                if (err) {

                    reject('Error al cargar usuarios', err);

                } else {

                    resolve(usuarios);
                }

            });

    });

}

// ========================================
// FIN BUSQUEDA GENERAL
// ========================================

module.exports = app;