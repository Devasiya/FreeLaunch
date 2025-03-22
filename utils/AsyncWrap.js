module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next); //in catch, next will be called
    }
}