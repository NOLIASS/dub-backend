if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  category: String,
  thumbnail: String,
  rating: Number,
  discountPercentage: Number,
  tags: [String],
  description: String,
})

app.use(cors())
app.use(express.json())

// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB підключено!')

    await Product.deleteMany() // очищаємо стару базу
    await Product.insertMany([
      {
        title: 'Стілець дубовий',
        price: 100,
        category: 'chairs',
        thumbnail: 'https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/thumbnail.png',
        rating: 4.5,
        discountPercentage: 10,
        tags: ['chairs'],
        description: 'Класичний стілець з натурального дуба'
      },
      {
        title: 'Стіл обідній',
        price: 200,
        category: 'tables',
        thumbnail: 'https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Sofa/thumbnail.png',
        rating: 4.2,
        discountPercentage: 5,
        tags: ['tables'],
        description: 'Просторий обідній стіл для всієї родини'
      },
      {
        title: 'Диван угловий',
        price: 500,
        category: 'sofas',
        thumbnail: 'https://cdn.dummyjson.com/products/images/furniture/Bedside%20Table%20African%20Cherry/thumbnail.png',
        rating: 4.8,
        discountPercentage: 15,
        tags: ['sofas'],
        description: 'Зручний кутовий диван для вашої вітальні'
      },
    ])
    console.log('Товари додано!')
  })
  .catch(err => console.log('Помилка:', err))

// Схема товару
const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  category: String,
  thumbnail: String,
})

// Модель товару
const Product = mongoose.model('Product', productSchema)

// Маршрути
app.get('/products', async (req, res) => {
  const products = await Product.find()
  res.json(products)
})

app.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).json({ message: 'Товар не знайдено' })
  res.json(product)
})

app.post('/products', async (req, res) => {
  const product = new Product(req.body)
  await product.save()
  res.json(product)
})

app.listen(process.env.PORT || 5000, () => {
  console.log(`Сервер запущено на порту ${process.env.PORT || 5000}`)
})

