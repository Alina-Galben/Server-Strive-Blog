import mongoose from "mongoose";
import bcrypt from 'bcrypt';

/*// Nome del database - quando nel .env non va inserito il nome del database, allora va creato il nome del DB
const dbName = 'sample_mflix'
*/

const authorsSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cognome: { type: String, required: false },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    dataDiNascita: { type: String, required: false },
    avatar: { type: String, required: true },
    password: { type: String, required: true},
    googleId: { type: String, unique: true, sparse: true },
}, {
    timestamps: true
})

// Cripta la password solo se modificata
authorsSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); 
})

const authorModel = mongoose.model('Authors', authorsSchema);
export default authorModel;
// module.exports = authorModel;