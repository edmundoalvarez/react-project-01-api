const accountService = require('../services/account.js')

function createAccount(req, res) {

    accountService.createAccount(req.body)
    .then(() => {
        res.status(201).json({msg: 'La cuenta ha sido creada con éxito'})
    })
    .catch((error)=>{
        res.status(500).json({msg: 'No se pudo crear la cuenta', err: error})
    })
}

async function deleteAccount(req,res){

    const { idJudge } = req.params
  
    return accountService.deleteAccount(idJudge)
    .then(function(account){
      res.status(200).json(account)
    })
    .catch(function (err){
      res.status(500).json({ msg:err.msg })
    })
}

async function updateAccount(req, res) {

    const { idJudge } = req.params

    return accountService.updateAccount(req.body, idJudge)
    .then(function (judge) {
        return res.status(200).json(judge)
    })
    .catch(function (err) {
        if (err?.code) {
            res.status(err.code).json({ msg: err.msg })
        }
        else {
            res.status(500).json({ msg: "No se pudo guardar en el archivo" })
        }
    })

}

async function updateEmail(req, res) {
    const { idJudge } = req.params;
    const { email } = req.body;

    console.log('id: ', idJudge);
    console.log('email: ', email);

    return accountService.updateEmail(email, idJudge)
        .then(function (judge) {
            return res.status(200).json(judge);
        })
        .catch(function (err) {
            if (err?.code) {
                res.status(err.code).json({ msg: err.msg });
            } else {
                res.status(500).json({ msg: "No se pudo guardar en el archivo 2" });
            }
        });
}

async function sendPasswordRecoveryEmail(req, res) {
    const { email } = req.body;

    try {
        await accountService.sendPasswordRecoveryEmail(email);
        res.status(200).json({ msg: 'Se ha enviado un correo electrónico para restablecer la contraseña' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en la recuperación de contraseña' });
    }
    
}

async function resetPassword(req, res){
    const { password } = req.body;
    const { token } = req.body;

    // console.log('Token recibido:', token);  // Agregar este log
    // console.log('Password recibido:', password);  // Agregar este log

    try {
        await accountService.resetPassword(token, password);
        res.status(200).json({ msg: 'Contraseña restablecida con éxito' });

        await accountService.deleteSession(token); 

    } catch (error) {
    
        res.status(500).json({ msg: 'Error al restablecer la contraseña 2' });
    }
}

function login(req, res) {
    accountService.createSession(req.body)
    .then((session) => {
        res.status(200).json(session);
    })
    .catch((error) => {
        const status = error?.status;
        res.status(status).json({ error: error.msg || 'No se pudo iniciar sesión.' });
    });
}

function logout(req, res) {
    accountService.deleteSession(req.token)
    .then(() => {
        res.status(200).json({msg: 'La sesión ha sido cerrada con éxito'})
    })
    .catch(()=>{
        res.status(500).json({msg: 'No se pudo cerrar sesión'})
    })
}

export default {
    createAccount,
    deleteAccount,
    updateAccount,
    updateEmail,
    login,
    sendPasswordRecoveryEmail,
    resetPassword,
    logout
}