export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Pawstudio';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Tablouri personalizate';
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
    email: '',
    password: '',
};

export const signUpDefaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword:'',
};

export const shippingAddressDefaultValues = {
    fullName: '',
    phoneNumber: '',
    streetAddress:'',
    city: '',
    postalCode: '',
    country: '',

}

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(', ')
  : ['PayPal', 'Card de credit', 'Numerar'];
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';