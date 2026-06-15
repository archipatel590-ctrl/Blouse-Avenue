import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();


// @desc    Get all products
// @route   GET /api/products
router.get('/', async (req, res) => {
  try {
    const productsList = await Product.find({});
    res.json(productsList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a product
// @route   POST /api/products
router.post('/', async (req, res) => {
  try {
    const {
      name,
      sku,
      price,
      image,
      hoverImage,
      category,
      categories,
      showInWatchShop,
      showOnHomepage,
      description,
      fabric,
      color,
      tag
    } = req.body;

    // Validate uniqueness of SKU
    const skuExists = await Product.findOne({ sku });
    if (skuExists) {
      return res.status(400).json({ message: 'SKU code already exists' });
    }

    // Generate unique frontend-like ID
    const generatedId = 'p-' + Date.now();

    const newProduct = new Product({
      id: generatedId,
      name,
      sku,
      price: (price !== undefined && !isNaN(Number(price))) ? Number(price) : 0,
      image: image || '/src/assets/products/prod_pearl_ivory.png',
      hoverImage: hoverImage || '',
      category: category || (categories && categories[0]) || 'Saree Wear Blouses',
      categories: categories || (category ? [category] : ['Saree Wear Blouses']),
      showInWatchShop: showInWatchShop !== undefined ? Boolean(showInWatchShop) : false,
      showOnHomepage: showOnHomepage !== undefined ? Boolean(showOnHomepage) : true,
      description: description || `${name} custom designer blouse silhouette.`,
      fabric,
      color,
      tag: tag || 'New'
    });

    const createdProduct = await newProduct.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    // id parameter can be _id or id string
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/) 
      ? { _id: req.params.id } 
      : { id: req.params.id };

    const product = await Product.findOne(query);

    if (product) {
      product.name = req.body.name || product.name;
      product.sku = req.body.sku || product.sku;
      product.price = (req.body.price !== undefined && !isNaN(Number(req.body.price))) ? Number(req.body.price) : product.price;
      product.image = req.body.image || product.image;
      product.hoverImage = req.body.hoverImage !== undefined ? req.body.hoverImage : product.hoverImage;
      product.category = req.body.category || product.category;
      product.categories = req.body.categories !== undefined ? req.body.categories : product.categories;
      product.showInWatchShop = req.body.showInWatchShop !== undefined ? Boolean(req.body.showInWatchShop) : product.showInWatchShop;
      product.showOnHomepage = req.body.showOnHomepage !== undefined ? Boolean(req.body.showOnHomepage) : product.showOnHomepage;
      product.description = req.body.description || product.description;
      product.fabric = req.body.fabric || product.fabric;
      product.color = req.body.color || product.color;
      product.tag = req.body.tag || product.tag;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/) 
      ? { _id: req.params.id } 
      : { id: req.params.id };

    const result = await Product.deleteOne(query);

    if (result.deletedCount > 0) {
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
