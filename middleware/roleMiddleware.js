

export const roleMiddleware = (...roles) => {
    return (req, res, next) => {

        const { id, role} = req.user;

        if(!roles.includes(role)){
            return res.status(403).json({
                code: 403,
                message: "Not Allowed"
            })
        }
        next();

    }

}