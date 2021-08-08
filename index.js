const express= require(`express`);
const mongoose= require(`mongoose`);
const morgan= require(`morgan`);
const cors= require(`cors`);
//env var
const DB= process.env.MONGODB_URI || `mongodb://localhost/notes`;
const PORT= process.env.PORT || 3000;
module.exports= PORT;
//obj constructor
const app= express();
//connect to db
mongoose.set(`useUnifiedTopology`, true);
mongoose.set(`useFindAndModify`, false);
mongoose.connect(DB, {useNewUrlParser: true})
    .then(() => console.log(`Connected to DB ${DB}`))
    .catch( err => console.error(`Error: ${err}`))
//middlewares
app.use(express.json());
app.use(morgan(`dev`));
app.use(cors())
app.use(`/api`, require(`./api/routes/note`));
//error handling
app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({error: err.message});
});
//listen
app.listen(PORT, () => console.log(`Listening on ${PORT}`));