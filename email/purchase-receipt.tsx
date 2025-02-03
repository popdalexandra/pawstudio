import {
    Body,
    Column,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
  } from '@react-email/components';
  import { Order } from '@/types';
  import { formatCurrency } from '@/lib/utils';
  import sampleData from '@/db/sample-data';
  import dotenv from 'dotenv';
  dotenv.config();
  
  PurchaseReceiptEmail.PreviewProps = {
    order: {
      id: crypto.randomUUID(),
      userId: '123',
      user: {
        name: 'Pop Denisa',
        email: 'test@test.com',
      },
      paymentMethod: 'Stripe',
      shippingAddress: {
          fullName: 'Pop Denisa',
          streetAddress: 'Dr. Ioan Muresan 105',
          city: 'Timisoara',
          postalCode: '305100',
          country: 'RO',
          phoneNumber: ''
      },
      createdAt: new Date(),
      totalPrice: '100',
      taxPrice: '10',
      shippingPrice: '10',
      itemsPrice: '80',
      orderitems: sampleData.products.map((x) => ({
        name: x.name,
        orderId: '123',
        productId: '123',
        slug: x.slug,
        qty: x.stock,
        image: x.images[0],
        price: x.price.toString(),
      })),
      isDelivered: true,
      deliveredAt: new Date(),
      isPaid: true,
      paidAt: new Date(),
      paymentResult: {
        id: '123',
        status: 'succeeded',
        pricePaid: '100',
        email_address: 'test@test.com',
      },
    },
  } satisfies OrderInformationProps;
  
  const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });
  
  type OrderInformationProps = {
    order: Order;
  };
  
  export default function PurchaseReceiptEmail({ order }: OrderInformationProps) {
    return (
      <Html>
        <Preview>Vezi detaliile comenzii</Preview>
        <Tailwind>
          <Head />
          <Body className='font-sans bg-white'>
            <Container className='max-w-xl'>
              <Heading>Detalii comandă</Heading>
              <Section>
                <Row>
                  <Column>
                    <Text className='mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap'>
                      ID
                    </Text>
                    <Text className='mt-0 mr-4'>{order.id.toString()}</Text>
                  </Column>
                  <Column>
                    <Text className='mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap'>
                      DATA
                    </Text>
                    <Text className='mt-0 mr-4'>
                      {dateFormatter.format(order.createdAt)}
                    </Text>
                  </Column>
                  <Column>
                    <Text className='mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap'>
                      PREȚ
                    </Text>
                    <Text className='mt-0 mr-4'>
                      {formatCurrency(order.totalPrice)}
                    </Text>
                  </Column>
                </Row>
              </Section>
              <Section className='border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4'>
                {order.orderitems.map((item) => (
                  <Row key={item.productId} className='mt-8'>
                    <Column className='w-20'>
                      <Img
                        width='80'
                        alt={item.name}
                        className='rounded'
                        src={
                          item.image.startsWith('/')
                            ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                            : item.image
                        }
                      />
                    </Column>
                    <Column className='align-top'>
                      {item.name} x {item.qty}
                    </Column>
                    <Column align='right' className='align-top'>
                      {formatCurrency(item.price)}
                    </Column>
                  </Row>
                ))}
                {[
                  { name: 'Produse', price: order.itemsPrice },
                  { name: 'Taxă de împachetare', price: order.taxPrice },
                  { name: 'Transport', price: order.shippingPrice },
                  { name: 'Total', price: order.totalPrice },
                ].map(({ name, price }) => (
                  <Row key={name} className='py-1'>
                    <Column align='right'>{name}: </Column>
                    <Column align='right' width={70} className='align-top'>
                      <Text className='m-0'>{formatCurrency(price)}</Text>
                    </Column>
                  </Row>
                ))}
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  }