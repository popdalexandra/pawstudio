const base = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

// Funcția pentru obținerea ratei de schimb
async function getExchangeRate(baseCurrency: string, targetCurrency: string): Promise<number> {
  const url = `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch exchange rate: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.rates[targetCurrency]; // Returnează rata de schimb din RON în USD
}

export const paypal = {
  // Crearea comenzii PayPal
  createOrder: async function createOrder(price: number) {
    const accessToken = await generateAccessToken();

    // Obține rata de schimb valutară
    const exchangeRate = await getExchangeRate('RON', 'USD'); // Rata de schimb RON -> USD
    const convertedPrice = (price * exchangeRate).toFixed(2); // Conversie și rotunjire la 2 zecimale
    
    const url = `${base}/v2/checkout/orders`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD', // Valuta în care se face plata (USD)
              value: convertedPrice, // Prețul convertit în USD
            },
          },
        ],
      }),
    });

    return handleResponse(response); // Tratează răspunsul de la PayPal
  },

  // Capturarea plății
  capturePayment: async function capturePayment(orderId: string) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderId}/capture`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return handleResponse(response); // Tratează răspunsul la capturarea plății
  },
};

// Generarea tokenului de acces pentru PayPal
async function generateAccessToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString('base64');
  
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const jsonData = await handleResponse(response);
  return jsonData.access_token; // Returnează tokenul de acces
}

// Tratează răspunsurile de la API
async function handleResponse(response: Response) {
  if (response.ok) {
    return response.json();
  } else {
    const errorMessage = await response.text();
    throw new Error(errorMessage); // Aruncă eroarea dacă răspunsul nu este OK
  }
}

export { generateAccessToken }; // Exportă funcția de generare token

