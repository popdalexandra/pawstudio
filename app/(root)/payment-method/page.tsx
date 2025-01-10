import { auth } from '@/auth';
import { getUserById } from '@/lib/actions/user.action';
import PaymentMethodForm from './payment-method-form';
import CheckoutSteps from '@/components/shared/checkout-steps';
import { APP_NAME } from '@/lib/constants';

export const metadata = {
    title: `Formular de livrare | ${APP_NAME}`
}

const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error('User not found');

  const user = await getUserById(userId);

  return (
    <>
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </>
  );
};

export default PaymentMethodPage;
