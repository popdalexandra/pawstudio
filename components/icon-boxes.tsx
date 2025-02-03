import { DollarSign, Headset, ShoppingBag, WalletCards } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const IconBoxes = () => {
  return (
    <div>
      <Card>
        <CardContent className='grid md:grid-cols-4 gap-4 p-4'>
          <div className='space-y-2'>
            <ShoppingBag />
            <div className='text-sm font-bold'>Transport gratuit</div>
            <div className='text-sm text-muted-foreground'>
              Transport gratuit la comenzile de peste 200 RON.
            </div>
          </div>
          <div className='space-y-2'>
            <DollarSign />
            <div className='text-sm font-bold'>Produsele nu se pot returna</div>
            <div className='text-sm text-muted-foreground'>
              Datorita faptului că sunt produse personalizate, acestea nu se pot returna.
            </div>
          </div>
          <div className='space-y-2'>
            <WalletCards />
            <div className='text-sm font-bold'>Plătiți flexibil</div>
            <div className='text-sm text-muted-foreground'>
              Plătește cu PayPal, card de credit sau la livrare.
            </div>
          </div>
          <div className='space-y-2'>
            <Headset />
            <div className='text-sm font-bold'>Discutăm toate detaliile</div>
            <div className='text-sm text-muted-foreground'>
              Înainte de precesarea comenzii discutăm toate detaliile.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IconBoxes;