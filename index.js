if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()

app.use(cors({
  origin: ['https://dub-furniture-teoz.vercel.app', 'http://localhost:5173'],
  credentials: true
}))
app.use(express.json())

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

const Product = mongoose.model('Product', productSchema)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
})

const User = mongoose.model('User', userSchema)

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB підключено!')

    await Product.deleteMany()
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
app.post('/register', async (req, res) => {
  const { email, password } = req.body
  const hashed = await bcrypt.hash(password, 10)
  const user = new User({ email, password: hashed })
  await user.save()
  res.json({ message: 'Користувач створений' })
})

// Логін
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ message: 'Невірний email' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ message: 'Невірний пароль' })

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
  res.json({ token })
})








app.listen(process.env.PORT || 5000, () => {
  console.log(`Сервер запущено на порту ${process.env.PORT || 5000}`)
})
