"use client";

import { PhotoIcon } from "@heroicons/react/24/solid";
import Input from "@/components/input";
import Button from "@/components/button";
import { useState } from "react";
import { getUploadUrl, uploadProduct } from "@/app/products/add/actions";
import { useFormState } from "react-dom";

export default function AddProduct() {
    const [preview, setPreview] = useState("");
    const [uploadUrl, setUploadUrl] = useState("");
    const [photoId, setPhotoId] = useState("");

    const onImageChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const {
            target: { files },
        } = event;

        if (!files) return;
        const file = files[0];

        if (!file.type.startsWith("image/")) {
            setPreview("");
            event.target.value = "";
            return alert("이미지 파일만 업로드 가능합니다.");
        }

        if (file.size > 1024 * 1024 * 2) {
            setPreview("");
            event.target.value = "";
            return alert("이미지 크기는 2MB를 초과할 수 없습니다.");
        }

        const url = URL.createObjectURL(file); // 파일이 업로드된 브라우저 메모리를 참조해서 주소를 생성한다.
        setPreview(url);

        const { success, result } = await getUploadUrl();
        if (success) {
            const { id, uploadURL } = result;
            setUploadUrl(uploadURL);
            setPhotoId(id);
        }
    };

    const interceptAction = async (_: any, formData: FormData) => {
        const file = formData.get("photo");
        if (!file) {
            return;
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

        formData.set(
            "photo",
            `https://imagedelivery.net/qWs23S0Dinq76C8FV_L81g/${photoId}`,
        ); // Cloud Flare 주소로 데이터 변조

        return uploadProduct(_, formData);
    };

    const [state, action] = useFormState(interceptAction, null);

    return (
        <div>
            <form action={action} className="flex flex-col gap-5 p-5">
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
                            {state?.fieldErrors.photo && (
                                <span className="text-sm text-red-500">
                                    {state?.fieldErrors.photo}
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
                    name="title"
                    placeholder="제목"
                    type="text"
                    required
                    errors={state?.fieldErrors.title}
                />
                <Input
                    name="price"
                    placeholder="가격"
                    type="number"
                    required
                    errors={state?.fieldErrors.price}
                />
                <Input
                    name="description"
                    placeholder="자세한 설명"
                    type="text"
                    required
                    errors={state?.fieldErrors.description}
                />
                <Button text="작성 완료" />
            </form>
        </div>
    );
}
