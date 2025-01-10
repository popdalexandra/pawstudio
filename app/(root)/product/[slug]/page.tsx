import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProductBySlug } from "@/lib/actions/product.action";
import { notFound } from "next/navigation";
import ProductPrice from '@/components/shared/product/product-price';
import ProductImages from "@/components/shared/product/product-images";
import AddToCarrt from "@/components/shared/product/add-to-cart";
import { getMyCart } from "@/lib/actions/cart.actions";

const ProductDetailsPage = async (props: {
    params: Promise<{slug:string}>

}) => {

    const{slug} = await props.params;
    const product = await getProductBySlug(slug);
    if(!product) notFound();

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
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="w-27 rounded-full bg-pink-200 text-pink-800 px-2 py-2"> <ProductPrice value={Number(product.price)} />
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
    </>
}
 
export default ProductDetailsPage;