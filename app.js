const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');


mongoose.connect('mongodb+srv://siddiqbaig:baig123@cluster0.ny1yutu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});


const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    email: String
});


const User = mongoose.model('User', userSchema);
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.use(express.static('public'));





app.get('/users/new' , (req,res)=>{
    res.render('new-user',{errors:null})
})


app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.render('user-list', {users});
    } catch (err) {
        res.status(500).send(err);
    }
});


app.get('/users/:id/edit', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('edit-user', {user,errors:null});
       
    } catch (err) {
        res.status(500).send(err);
    }
});


app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.redirect('/users');
    } catch (err) {
        res.status(500).send(err);
    }
});


app.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.redirect('/users');
    } catch (err) {
        res.status(500).send(err);
    }
});


app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.redirect('/users');
    } catch (err) {
        res.status(500).send(err);
    }
});


const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
