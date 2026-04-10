import jwt from 'jsonwebtoken'

export const isAuth = (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({
            status: 'error',
            message: 'Acceso denegado, debe enviar un token'
        })
    }

    if (!authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            message: 'Formato de token invalido'
        })
    }

    const token = authorization.split(' ')[1]

    try {
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = tokenDecoded
        next()
    } catch {
        return res.status(401).json({
            status: 'error',
            message: 'Acceso denegado, token invalido o expirado'
        })
    }
}
