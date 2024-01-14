const yup = require('yup');

const GameSchema = yup.object({
    name: yup.string()
        .required({name: 'El nombre es obligatorio.'}),
    genre: yup.string()
        .required({genre:'El genero es obligatorio.'}),
    members: yup.array()
        .required({members: 'Los creadores son obligatorios.'})
        .min(1, {members: 'Al menos debe haber 1 creador por juego.'}),
    edition: yup.string()
        .required({edition: 'El año de lanzamiento es obligatorio.'}),
    img: yup.string()
        .required({img: 'La URL de la imagen es obligatoria.'})
        .url({img: 'La URL de la imagen no es válida.'}),
})

export {
    GameSchema
}