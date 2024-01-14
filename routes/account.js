const express = require('express')
const accountController = require('../controllers/account.js')
const { validateAccount, verifySession } = require('../middlewares/account.js')

const route = express.Router()

route.post('/account', [validateAccount], accountController.createAccount)
route.delete('/judges/:idJudge', accountController.deleteAccount)
route.patch('/judges/:idJudge',[validateAccount], accountController.updateAccount)
route.patch('/judges/:idJudge/change-email', accountController.updateEmail)

route.post('/session', [validateAccount], accountController.login)
route.delete('/session', [verifySession], accountController.logout)

route.post('/password-recovery', accountController.sendPasswordRecoveryEmail);
route.post('/reset-password', accountController.resetPassword);

export default route 