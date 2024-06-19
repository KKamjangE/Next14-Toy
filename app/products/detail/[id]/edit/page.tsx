import { getCachedProduct, getIsOwner } from "@/app/products/detail/actions";
import ProductEditForm from "@/components/product-edit-form";
import { notFound } from "next/navigation";

export default async function EditProduct({
    params,
}: {
    params: { id: string };
}) {
    const id = Number(params.id);

    if (isNaN(id)) {
        return notFound();
    }

    const product = await getCachedProduct(id);

    if (!product) {
        return notFound();
    }

    const isOwner = getIsOwner(product.userId);

    if (!isOwner) {
        return notFound();
    }
    return <ProductEditForm id={id} product={product} />;
}
