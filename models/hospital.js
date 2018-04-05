var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    img: { type: String, required: false },
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'hospitales' });

module.exports = mongoose.model('Hospital', hospitalSchema);