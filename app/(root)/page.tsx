// import ProductList from "@/components/shared/product/product-list"
// import { gateLatestProducts } from "@/lib/actions/product.actions"


// export const metadata = {
//   title: 'Home',
// }


// const Homepage = async () => {

//   const latestProducts = await gateLatestProducts()

//   return (
//     <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
//   )
// }

// export default Homepage 

// app/(root)/page.tsx
import ProductList from "@/components/shared/product/product-list"
import { gateLatestProducts } from "@/lib/actions/product.actions"

export const metadata = { title: "Home" }

export default async function Homepage() {
  const latestProducts = await gateLatestProducts()
  return <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
}
