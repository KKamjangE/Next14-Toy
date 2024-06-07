"use client";

import { PhotoIcon } from "@heroicons/react/24/solid";
import Input from "@/components/input";
import Button from "@/components/button";
import { useState } from "react";
import { getUploadUrl, uploadProduct } from "@/app/products/add/actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductType, productSchema } from "@/app/products/add/schema";

export default function AddProduct() {
    const [preview, setPreview] = useState("");
    const [uploadUrl, setUploadUrl] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ProductType>({
        resolver: zodResolver(productSchema),
    });

    const onImageChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const {
            target: { files },
        } = event;

        if (!files) return;
        const file = files[0];

        const url = URL.createObjectURL(file); // 파일이 업로드된 브라우저 메모리를 참조해서 주소를 생성한다.
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
        // 파일 타입 검사
        if (!(file instanceof File)) {
            return alert("파일이 유효하지 않습니다.");
        }

        // 파일 확장자 검사
        if (!file.type.startsWith("image/")) {
            setPreview("");
            return alert("이미지 파일만 업로드 가능합니다.");
        }

        // 파일 크기 검사
        if (file.size > 1024 * 1024 * 2) {
            setPreview("");
            return alert("이미지 크기는 2MB를 초과할 수 없습니다.");
        }

        const cloudflareForm = new FormData();
        cloudflareForm.append("file", file);
        // 이미지 업로드
        const response = await fetch(uploadUrl, {
            method: "POST",
            body: cloudflareForm,
        });

        if (response.status !== 200) {
            return;
        }

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("price", data.price + "");
        formData.append("description", data.description);
        formData.append("photo", data.photo);
        return uploadProduct(formData);
    });

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
                    errors={[errors.title?.message ?? ""]}
                    {...register("title")}
                />
                <Input
                    placeholder="가격"
                    type="number"
                    required
                    errors={[errors.price?.message ?? ""]}
                    {...register("price")}
                />
                <Input
                    placeholder="자세한 설명"
                    type="text"
                    required
                    errors={[errors.description?.message ?? ""]}
                    {...register("description")}
                />
                <Button text="작성 완료" />
            </form>
        </div>
    );
}
