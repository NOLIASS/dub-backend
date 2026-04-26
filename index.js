require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

app.use(cors())
app.use(express.json())

// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB підключено!')

    const count = await Product.countDocuments()
    if (count === 0) {
      await Product.insertMany([
        { title: 'Стілець дубовий', price: 100, category: 'chairs' },
        { title: 'Стіл обідній', price: 200, category: 'tables' },
        { title: 'Диван угловий', price: 500, category: 'sofas' },
      ])
      console.log('Тестові товари додано!')
    }
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

app.listen(process.env.PORT, () => {
  console.log(`Сервер запущено на порту ${process.env.PORT}`)
})