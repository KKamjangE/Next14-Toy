import EditForm from "@/components/edit-form";
import { getCachedProduct, getIsOwner } from "@/app/products/detail/actions";
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
    return <EditForm id={id} product={product} />;
}
