import Slug from "@/components/Slug";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const ProductSlugPage = async ({ params }: PageProps) => {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.SERVER}/api/product/${slug}`
  );


  const product =  res.ok ? await res.json() : null

  return <Slug data={product} />;
};

export default ProductSlugPage;
