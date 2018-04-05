var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;




    //Tipos de colección

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no valida',
            errors: { message: 'Las colecciones validas son: ' + tiposValidos.join(', ') }
        });
    }

    //Fin Tipos de colección




    if (!req.files) {

        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });

    }




    // Obtener nombre del archivo

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Fin Obtener nombre del archivo




    // Validacion extensiones de archivos

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son: ' + extensionesValidas.join(', ') }
        });
    }

    // Fin Validacion extensiones de archivos




    // Crear nombre de archivo personalizado

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Fin Crear nombre de archivo personalizado




    //Mover el archivo del temporal a un path especifico

    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });

        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido',
        //     extensionArchivo: extensionArchivo
        // });

    });

    //Fin Mover el archivo del temporal a un path especifico

});



function subirPorTipo(tipo, id, nombreArchivo, res) {


    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {

                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });

            }

            var pathViejo = './uploads/usuarios/' + usuario.img;



            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo);
            }


            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ';)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            });

        });

    }


    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {

                return res.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe' }
                });

            }


            var pathViejo = './uploads/medicos/' + medico.img;



            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo);
            }


            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {


                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del medico actualizada',
                    usuario: medicoActualizado
                });

            });

        });

    }


    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {

                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });

            }

            var pathViejo = './uploads/hospitales/' + hospital.img;



            if (fs.existsSync(pathViejo)) {

                fs.unlink(pathViejo);
            }


            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {


                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen del hospital actualizada',
                    usuario: hospitalActualizado
                });

            });

        });

    }


}

module.exports = app;