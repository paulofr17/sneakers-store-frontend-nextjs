export type HomeDictionary = {
  headerText: string
  language: string
  homepage: string
  brands: string
  faq: string
  shop: string
  search: string
  shopNow: string
  bestSellers: string
  testimonials: string
  login: string
  register: string
  logout: string
  footerText: string
}

export type CartDictionary = {
  title: string
  size: string
  quantity: string
  remove: string
  subtotal: string
  shippinginfo: string
  checkout: string
  or: string
  continueShopping: string
  productRemoved: string
  errorRemovingProduct: string
  orderCreated: string
  errorCreatingOrder: string
}

export type ProductsDictionary = {
  brands: string
  price: string
  size: string
  addToCart: string
  productAdded: string
  errorAddingProduct: string
}

export type FaqDictionary = {
  freeShipping: string
  shippingCondictions: string
  shipTo: string
  shipCountries: string
  securePayment: string
  securePercent: string
  sslCertificate: string
  faq1Question: string
  faq1Answer: string
  faq2Question: string
  faq2Answer: string
  faq3Question: string
  faq3Answer: string
  faq4Question: string
  faq4Answer: string
}

export type SignInDictionary = {
  titleSignin: string
  email: string
  invalidEmail: string
  password: string
  invalidPassword: string
  rememberMe: string
  forgotPassword: string
  continueWith: string
  notAmember: string
  createAccount: string
  invalidCredentials: string
}

export type SignUpDictionary = {
  titleSignup: string
  firstName: string
  firstNamePlaceholder: string
  lastName: string
  lastNamePlaceholder: string
  shortFieldError: string
  longFieldError: string
  email: string
  invalidEmail: string
  emailAlreadyExists: string
  password: string
  invalidPassword: string
  signupButton: string
  continueWith: string
  alreadyHaveAccount: string
  loginHere: string
}

export type ForgotPasswordDictionary = {
  title: string
  instructions: string
  email: string
  sendButton: string
  backButton: string
  successToastMessage: string
}

export type ResetPasswordDictionary = {
  title: string
  password: string
  passwordPlaceholder: string
  requiredPassword: string
  invalidPassword: string
  passwordConfirmation: string
  passwordConfirmationPlaceholder: string
  invalidPasswordConfirmation: string
  resetButton: string
  successToastMessage: string
  errorToastMessage: string
}

export type OrdersDictionary = {
  title: string
  description: string
  emptyOrders: string
  orderNumber: string
  orderDate: string
  orderStatus: string
  orderTotal: string
  size: string
  quantity: string
  viewProduct: string
  orderPending: string
  orderInTransit: string
  orderCompleted: string
}

export type Dictionary = {
  home: HomeDictionary
  cart: CartDictionary
  products: ProductsDictionary
  faq: FaqDictionary
  signIn: SignInDictionary
  signUp: SignUpDictionary
  forgotPassword: ForgotPasswordDictionary
  resetPassword: ResetPasswordDictionary
  orders: OrdersDictionary
}
