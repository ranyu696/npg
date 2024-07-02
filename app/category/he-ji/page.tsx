import { redirect } from 'next/navigation';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

async function getCategories() {
  const res = await fetch(
    `http://127.0.0.1:1337/api/categories/51?populate=subcategories.*`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch category data');
  }

  const data = await res.json();

  return data.data;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategories();
  const firstSubcategory = category.attributes.subcategories.data[0];

  if (!params.slug) {
    redirect(
      `/category/${category.attributes.slug}/${firstSubcategory.attributes.slug}`
    );
  }

  return null;
}
