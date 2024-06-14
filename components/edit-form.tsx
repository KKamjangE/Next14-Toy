"use client";

import { getUploadUrl } from "@/app/products/add/actions";
import { ProductType, productSchema } from "@/app/products/add/schema";
import {
    deletePhoto,
    deleteProduct,
    updateProduct,
} from "@/app/products/detail/[id]/edit/actions";
import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function EditForm({
    id,
    product,
}: {
    id: number;
    product: ProductType;
}) {
    const [preview, setPreview] = useState(`${product.photo}/public`);
    const [file, setFile] = useState<File | null>(null);
    const [uploadUrl, setUploadUrl] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors },
    } = useForm<ProductType>({
        resolver: zodResolver(productSchema),
    });

    useEffect(() => {
        setValue("photo", product.photo);
    });

    const onImageChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const {
            target: { files },
        } = event;

        if (!files) return;

        const file = files[0];

        const url = URL.createObjectURL(file);

        setPreview(url);
        setFile(file);

        const { success, result } = await getUploadUrl();

        if (success) {
            const { id, uploadURL } = result;
            setUploadUrl(uploadURL);
            setValue(
                "photo",
                `https://imagedelivery.net/qWs23S0Dinq76C8FV_L81g/${id}`,
            );
        }
    };

    const onSubmit = handleSubmit(async (data: ProductType) => {
        if (data.photo !== product.photo) {
            if (!(file instanceof File)) {
                return alert("파일이 유효하지 않습니다.");
            }

            if (!file.type.startsWith("image/")) {
                setPreview("");
                return alert("이미지 파일만 업로드 가능합니다.");
            }

            if (file.size > 1024 * 1024 * 2) {
                setPreview("");
                return alert("이미지 크기는 2MB를 초과할 수 없습니다.");
            }

            const cloudflareForm = new FormData();
            cloudflareForm.append("file", file);
            const response = await fetch(uploadUrl, {
                method: "POST",
                body: cloudflareForm,
            });
            if (response.status === 200) {
                deletePhoto(product.photo);
            } else {
                return;
            }
        }

        const formData = new FormData();
        formData.append("id", id + "");
        formData.append("title", data.title);
        formData.append("price", data.price + "");
        formData.append("description", data.description);
        formData.append("photo", data.photo);
        const errors = await updateProduct(formData);
        if (errors) {
            for (const [field, message] of Object.entries(errors.fieldErrors)) {
                setError(field as keyof ProductType, {
                    message: message.join(", "),
                });
            }
        }
    });

    const onDelete = () => {
        const ok = window.confirm("삭제하시겠습니까?");

        if (!ok) return;

        deleteProduct(id);
    };

    const onValid = async () => {
        await onSubmit();
    };

    return (
        <div>
            <form action={onValid} className="flex flex-col gap-5 p-5">
                <label
                    htmlFor="photo"
                    className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-neutral-300 bg-cover bg-center text-neutral-300"
                    style={{ backgroundImage: `url(${preview})` }}
                >
                    {!preview && (
                        <>
                            <PhotoIcon className="w-20" />
                            <div className="text-sm text-neutral-400">
                                사진을 추가해주세요.
                            </div>
                            {errors.photo?.message && (
                                <span className="text-sm text-red-500">
                                    {errors.photo?.message}
                                </span>
                            )}
                        </>
                    )}
                </label>
                <input
                    type="file"
                    id="photo"
                    name="photo"
                    className="hidden"
                    accept="image/*"
                    onChange={onImageChange}
                />
                <Input
                    placeholder="제목"
                    type="text"
                    required
                    defaultValue={product.title}
                    errors={[errors.title?.message ?? ""]}
                    {...register("title")}
                />
                <Input
                    placeholder="가격"
                    type="number"
                    required
                    defaultValue={product.price}
                    errors={[errors.price?.message ?? ""]}
                    {...register("price")}
                />
                <Input
                    placeholder="자세한 설명"
                    type="text"
                    required
                    defaultValue={product.description}
                    errors={[errors.description?.message ?? ""]}
                    {...register("description")}
                />
                <Button text="작성 완료" />
                <button
                    onClick={onDelete}
                    type="button"
                    className="h-10 w-full whitespace-nowrap rounded-md bg-red-500 font-medium text-white transition-colors hover:bg-red-400"
                >
                    Delete Product
                </button>
            </form>
        </div>
    );
}
