import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions/product.action";
import { notFound } from "next/navigation";
import ProductPrice from '@/components/shared/product/product-price';
import ProductImages from "@/components/shared/product/product-images";
import AddToCarrt from "@/components/shared/product/add-to-cart";
import { getMyCart } from "@/lib/actions/cart.actions";
import ReviewList from "./review-list";
import { auth } from "@/auth";

const ProductDetailsPage = async (props: {
    params: Promise<{slug:string}>

}) => {

    const{slug} = await props.params;
    const product = await getProductBySlug(slug);
    if(!product) notFound();

    const session = await auth();
    const userId = session?.user?.id;

    const cart = await getMyCart();

    return <>
    <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
            {/*Coloana1: Imagine */}
            <div className="col-span-2">
                {/*Images component */}
                <ProductImages images={product.images}/>
            </div>
            {/*Coloana2: Detalii*/}
            <div className="col-span-2 p-5">
                <div className="flex flex-col gap-6">
                    <p>
                        {product.brand} {product.category}
                    </p>
                    <h1 className="h3-bold">{product.name}</h1>
                    <p>{product.rating} of { product.numReviews} reviews</p>
                    <div className="flex items-center gap-1">
                    <div className="bg-pink-200 text-pink-800 px-2 py-1 rounded-full flex items-center">
                        <ProductPrice value={Number(product.price)} />
                        <span className="ml-1">RON</span>
                    </div>
                    </div>
                </div>
                <div className="mt-10">
                <p className="font-semibold">Descriere</p>
                <p>{product.description}</p></div>
            </div>
            {/*Coloana3: Actiuni */}
            <div>
                <Card>
                    <CardContent className="p-4">
                        <div className="mb-2 flex justify-between">
                            <div>Pret</div>
                            <div>
                                <ProductPrice value={Number(product.price)}></ProductPrice>
                            </div>
                        </div>
                        <div className="mb-2 flex  justify-between">
                            <div>Status</div>
                            {product.stock > 0 ? (
                                <Badge variant = 'outline'>Disponibil</Badge>
                            ) : (
                                <Badge variant='destructive'> Indisponibil</Badge>
                            )}
                        </div>
                        {product.stock > 0 && (
                            <div className="flex-center">
                                <AddToCarrt 
                                cart = {cart}
                                item={{
                                    productId: product.id,
                                    name: product.name,
                                    slug: product.slug,
                                    price: product.price,
                                    qty:1,
                                    image: product.images![0],
                                }}/>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </section>

    <section className='mt-10'>
        <h2 className='h2-bold mb-5'>Recenzii</h2>
        <ReviewList
          userId={userId || ''}
          productId={product.id}
          productSlug={product.slug}
        />
      </section>

    </>
}
 
export default ProductDetailsPage;