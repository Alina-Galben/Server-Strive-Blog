import mongoose from "mongoose";

/*// Nome del database - quando nel .env non va inserito il nome del database va creato il nome del DB
const dbName = 'sample_mflix'
*/

// Lo SCHEMA di Mongoose sara la struttura di ogni oggetto che salvero nella Collection
const authorsSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    email: { type: String, required: true },
    dataDiNascita: { type: String, required: true },
    avatar: { type: String, required: true },
}, {
    timestamps: true
})

const authorModel = mongoose.model('Authors', authorsSchema);
export default authorModel;
// module.exports = authorModel;