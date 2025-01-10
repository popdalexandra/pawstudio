import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Conversie din prisma object in regular JS object
export function convertToPlainObject<T>(value: T): T{
  return JSON.parse(JSON.stringify(value));
}

// Format pentru numerele decimale
export function formatNumberWithDecimal(num: number): string{
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

// Format Errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error:any){
    if(error.name ==='ZodError'){
      //Handle Zod error
      const fieldErrors = Object.keys(error.errors).map((field) => error.errors[field].message);
      return fieldErrors.join(' ');
    }
    else if (error.name === 'PrismaClientKnownRequestError' && error.code === 'P2002'){
      //Handle Prisma Error
      const field = error.meta.target ? error.meta.target[0] : 'Field';
      return `${field.charAt(0).toUpperCase() + field.slice(1)} deja exista.`;

    }
    else{
      //Handle other errors
      return typeof error.message === 'string' ? error.message : JSON.stringify(error.message); 
    }
}

export function round2(value: number | string) {
  if(typeof value === 'number'){
    return Math.round((value + Number.EPSILON) * 100 ) /100;

  }else if (typeof value === 'string'){
    return Math.round((Number(value) + Number.EPSILON) * 100 ) /100;
  }else {
    throw new Error('Valoarea nu este numar sau string.')
  }

}

const EXCHANGE_RATE = 4.98; // Exemplu: 1 EUR = 4.98 RON

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-RO', {
  currency:'RON',
  style: 'currency',
  minimumFractionDigits:2,
});

const EUR_FORMATTER = new Intl.NumberFormat('en-RO', {
  currency: 'EUR',
  style: 'currency',
  minimumFractionDigits: 2,
});

// export function formatCurrency(amount: number | string | null) {
//   if(typeof amount === 'number'){
//     return CURRENCY_FORMATTER.format(amount);
//   } else if(typeof amount === 'string' ){
//     return CURRENCY_FORMATTER.format(Number(amount));
//   } else {
//     return 'Nan';
//   }
// }

export function formatCurrency(
  amount: number | string | null,
  currency: 'RON' | 'EUR' = 'RON' // Moneda curentă, implicit RON
) {
  if (amount === null) return 'NaN';

  const numericAmount = typeof amount === 'string' ? Number(amount) : amount;

  // Conversie între monede
  let convertedAmount = numericAmount;
  if (currency === 'EUR') {
    convertedAmount = numericAmount / EXCHANGE_RATE; // Din RON în EUR
    return EUR_FORMATTER.format(convertedAmount);
  }

  return CURRENCY_FORMATTER.format(convertedAmount); // Implicit RON
}

// Shorten UUID
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`; //ultimele 6 caractere
}

// Format date and times
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // numele lunii abreviat (e.g., 'ian.')
    year: 'numeric', // an numeric complet (e.g., '2025')
    day: 'numeric', // zi numerică (e.g., '10')
    hour: 'numeric', // oră numerică (e.g., '15')
    minute: 'numeric', // minut numeric (e.g., '30')
    hour12: false, // folosește formatul de 24 de ore
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // ziua săptămânii abreviată (e.g., 'lun.')
    month: 'short', // numele lunii abreviat (e.g., 'ian.')
    year: 'numeric', // an numeric complet (e.g., '2025')
    day: 'numeric', // zi numerică (e.g., '10')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // oră numerică (e.g., '15')
    minute: 'numeric', // minut numeric (e.g., '30')
    hour12: false, // folosește formatul de 24 de ore
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'ro-RO',
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    'ro-RO',
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    'ro-RO',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};


// const test = new Date('2023-10-25T08:30:00Z');
// const format = formatDateTime(test);

// console.log(format.dateTime);
// console.log(format.dateOnly);
// console.log(format.timeOnly);