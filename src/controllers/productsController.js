const fs = require('fs');
const path = require('path');
const { stringify } = require('querystring');
const { receiveMessageOnPort } = require('worker_threads');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render('products', { products, toThousand })
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let detalle = products.find(product => product.id == req.params.id);
		res.render('detail', { detalle, toThousand });
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form')
	},

	// Create -  Method to store
	store: (req, res) => {
		let newProduct = {
			id: products[products.length -1].id + 1,
			...req.body, 
			image: 'default-image.png',
		}

		products.push(newProduct);

		fs.writeFileSync(productsFilePath,JSON.stringify(products,null,' '));
		res.redirect('/');
	},

	// Update - Form to edit
	edit: (req, res) => {
		let edit = products.find(product => product.id == req.params.id);
		res.render('product-edit-form', { edit });
	},
	// Update - Method to update
	update: (req, res) => {
		let update = products.find(product => product.id == req.params.id);
		let productToEdit = {
			id: update.id,
			...req.body, 
			image: update.image,
		}

		let newProducts = products.map(product =>{
			if (product.id == productToEdit.id) {
				return product = {...productToEdit}
			}
			return product;
		})
		
		fs.writeFileSync(productsFilePath,JSON.stringify(newProducts,null,' '));
		res.redirect('/');
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {

		let newProducts = products.filter(product => product.id != req.params.id);
		fs.writeFileSync(productsFilePath,JSON.stringify(newProducts,null,' '));
		res.redirect('/');

	}
};

module.exports = controller;