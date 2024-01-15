import { MongoClient, ObjectId } from 'mongodb';
// import { updatePassword } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const client = new MongoClient('mongodb+srv://edmundoalvarezok:Checho.150566@api-edi.six0hm3.mongodb.net/')
const db = client.db("api-juegos")
const AccountsCollection = db.collection('accounts');
const TokensCollection = db.collection('tokens');

async function createAccount(data) {
    await client.connect()

    const newAccount = {
        ...data,
        rol: 2,
    }

    const salt = await bcrypt.genSalt(10)

    newAccount.password = await bcrypt.hash(data.password, salt)

    await AccountsCollection.insertOne(newAccount)

    return

}

async function verifyAccount(account) {
    await client.connect();

    const accountFound = await AccountsCollection.findOne({ email: account.email });

    if (!accountFound) {
        throw { status: 400, msg: 'No se encuentra el email.' };
    }

    const isMatch = await bcrypt.compare(account.password, accountFound.password);

    if (!isMatch) {
        throw { status: 400, msg: 'Contraseña incorrecta.' };
    }

    return { ...account, password: undefined, id: accountFound._id, rol: accountFound.rol };
}

async function createToken(payload){
    const token = jwt.sign(payload, 'secret')

    TokensCollection.insertOne({token, email: payload.email})

    return token
}

async function createSession(account){  

    return {
        account: await verifyAccount(account),
        token: await createToken({...account, password: undefined})
    }
}

async function verifyToken(token){

    await client.connect();

    const payload = jwt.verify(token, 'secret')

    if(!await TokensCollection.findOne({token})){
        throw {msg: 'Token inválido'}
    }

    return payload
}

async function deleteSession(token){
    await client.connect();

    await TokensCollection.deleteOne({token})

}

async function deleteAccount(id){

    try {
        const result = await AccountsCollection.deleteOne({_id: new ObjectId(id)});
        console.log(result); // Loguea el resultado para depuración
        return result;
    } catch (error) {
        console.error(error); // Loguea el error para depuración
        throw {msg: 'Error al eliminar la cuenta.'};
    }
}

async function updateAccount(data, id) { 
    await client.connect()

    return AccountsCollection.updateOne({_id: new ObjectId(id)}, {$set: data})

}

async function updateEmail(email, id) { 
    await client.connect()

    return AccountsCollection.updateOne({_id: new ObjectId(id)}, {$set: {email: email}})

}

async function updatePassword(email, newPassword) {

        let password = newPassword

        let salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(newPassword, salt);

        await AccountsCollection.updateOne({ email: email }, { $set: { password: password } });
        return { msg: 'Contraseña actualizada con éxito' };
        
}

async function sendPasswordRecoveryEmail(email) {
    await client.connect();

    const user = await AccountsCollection.findOne({ email });

    if (!user) {
        throw { status: 404, msg: 'El correo electrónico no está registrado' };
    }

    // Genera token único
    const recoveryToken = jwt.sign({ email }, 'secret', { expiresIn: '1h' });

    // Guarda el token
    TokensCollection.insertOne({ token: recoveryToken, email });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'edmundo.alvarez@davinci.edu.ar',
            pass: 'mgpc qrwg rzev xdzu',
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: 'edmundo.alvarez@davinci.edu.ar',
        to: email,
        subject: 'Recuperación de contraseña',
        text: `Haz clic en el siguiente enlace para restablecer tu contraseña: http://localhost:5173/restablecer-contrasena?token=${recoveryToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            throw { msg: 'Error al enviar el correo electrónico de recuperación de contraseña', error };
        }
        console.log('Correo electrónico enviado: ' + info.response);
    });

    return { msg: 'Se ha enviado un correo electrónico para restablecer la contraseña' };
}

async function resetPassword(token, password){

    // Validar el token
    const payload = await verifyToken(token);

    // Actualizar la contraseña
    await updatePassword(payload.email, password);

    return;

}


export default {
    createAccount,
    createSession,
    deleteSession,
    deleteAccount,
    updateAccount,
    updateEmail,
    sendPasswordRecoveryEmail,
    resetPassword,
    verifyToken
}