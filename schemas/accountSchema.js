const yup = require('yup');

const AccountSchema = yup.object({
    email: yup.string()
        .email({email: 'Debe ser un email'})
        .min(7, {email: 'El email debe tener mínimo 7 caracteres'})
        .required({email: 'El email es obligatorio'}),
    password: yup.string()
        .min(6, {password: 'La contraseña debe tener mínimo 7 caracteres'})
        .required({password:'La contraseña es obligatoria'}),
})

export {
    AccountSchema
}