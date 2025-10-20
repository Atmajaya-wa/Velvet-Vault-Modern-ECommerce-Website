import ProductList from "@/components/shared/product/product-list"
import sampleData from "@/db/sample-data"


export const metadata = {
  title: 'Home',
}


const Homepage = () => {

  return (
    <ProductList data={sampleData.products} title="Newest Arrivals" limit={4} />
  )
}

export default Homepage