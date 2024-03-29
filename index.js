const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/shop',{ useNewUrlParser: true})
   .then(()=>{
       console.log('MONGO CONNECTION OPEN!');
   })
   .catch(err=>{
       console.log('MONGO ERROR')
       console.log(err)
   })


app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))

const categories = ['fruit','vegetable','dairy']

app.get('/products', async (req, res) => {
    const {category} = req.query;
    if (category) {
        const products = await Product.find({category})
        res.render('products/index', {products})
    }
    else{
        const products = await Product.find({})
        res.render('products/index', {products})
    }
})

app.get('/products/new', (req, res) => {
    res.render('products/new',{categories})
})

app.post('/products',async(req, res) => {
    const newProduct = await Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct.id}`)
})
app.get('/products/:id', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('products/show',{product});
})
app.get('/products/:id/edit', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('products/edit',{product, categories});
})

app.put('/products/:id', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body,{runValidators:true});
    console.log(req.body);
    res.redirect(`/products/${product.id}`);
})

app.delete('/products/:id', async (req, res) => {
    const {id} = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products')
})

app.listen(3000, ()=>{
    console.log('Listening on Port 3000');
})