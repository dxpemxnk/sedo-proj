const router = require("express").Router();
const BookRouter = require("./api.doc.routes");
const AuthRegRouter = require('./api.auth.routes');
const CatRouter = require('./api.cat.routes')

router.use("/api/docs",BookRouter).use('/api/auth',AuthRegRouter).use('/api/cat',CatRouter)

module.exports = router