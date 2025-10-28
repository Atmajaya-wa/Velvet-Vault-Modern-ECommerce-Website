import ProductPrice from "@/components/shared/product/product-price";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import ProductImages from "@/components/shared/product/product-images";
import AddToCart from "@/components/shared/product/add-to-cart";
import { getMyCart } from "@/lib/actions/cart.actions";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const ProductDetailsPage = async (props: PageProps) => {
  const { slug } = await props.params; // Next 15 Promise params
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const cart = await getMyCart();

  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="col-span-2">
            <ProductImages images={product.images} />
          </div>

          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
              <p>{product.brand} {product.category}</p>
              <h1 className="h3-bold">{product.name}</h1>
              <p>{product.rating.toFixed(1)} of {product.numReviews} Reviews</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center mt-10">
              <ProductPrice
                value={product.price}
                className="w-24 rounded-full bg-green-100 text-green-700 outline-1 outline-green-700 px-5 py-2"
              />
            </div>

            <div className="mt-10">
              <p className="font-semibold">Description</p>
              <p>{product.description}</p>
            </div>
          </div>

          <div>
            <Card>
              <CardContent className="p-4 pb-0">
                <div className="mb-2 flex justify-between">
                  <div>Price</div>
                  <div><ProductPrice value={product.price} /></div>
                </div>

                <div className="mb-2 flex justify-between">
                  <div>Status</div>
                  {product.stock > 0 ? (
                    <Badge className="bg-green-100 text-green-900 outline-1 outline-green-700">
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>

                {product.stock > 0 && (
                  <div className="flex-center mt-5">
                    <AddToCart
                      cartItems={(cart?.items ?? [])}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        image: product.images![0],
                        price: product.price,
                        qty: 1,
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetailsPage;
