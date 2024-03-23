export type ProductStock = {
  id: number
  quantity: number
  size: string
}
export type ProductVariant = {
  id: number
  slug: string
  price: number
  color: string
  stock: number
  preview_image: string
  image: string[]
  product_stock: ProductStock[]
}

export type Product = {
  id: number
  name: string
  description: string
  price: number
  stock: number
  image: string
  categories: string[]
  variants: ProductVariant[]
}

export type BestSellerProduct = {
  id: number
  name: string
  slug: string
  price: number
  image: string
}

export type CartItem = {
  cart_item_id: number
  product_id: number
  quantity: number
  name: string
  description: string
  price: number
  color: string
  size: number
  preview_image: string
}

export type Cart = {
  id: number
  cartItems: CartItem[]
}

export type OrderItem = {
  id: number
  order_id: number
  product_id: number
  product_stock_id?: number
  name: string
  slug: string
  description: string
  preview_image: string
  color: string
  size: string
  quantity: number
  price: number
  totalPrice: number
  created_at: string
  updated_at: string
}

export type Order = {
  id: number
  user_id: number
  quantity: number
  price: number
  created_at: string
  updated_at: string
  order_item: OrderItem[]
}

export type Dashboard = {
  orders: number
  ordersInRange: number
  products: number
  productsInRange: number
  productVariants: number
  productVariantsInRange: number
  users: number
  usersInRange: number
  revenue: number
  revenueInRange: number
}
