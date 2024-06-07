"use client";

import { getMoreProducts } from "@/app/(tabs)/home/actions";
import { InitialProducts } from "@/app/(tabs)/home/page";
import ListProduct from "@/components/list-product";
import { useEffect, useRef, useState } from "react";

interface ProductListProps {
    initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
    const [products, setProducts] = useState(initialProducts);
    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const trigger = useRef<HTMLSpanElement>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            async (
                entries: IntersectionObserverEntry[], // 관찰 대상들
                observer: IntersectionObserver, // 옵저버
            ) => {
                const element = entries[0];
                if (element.isIntersecting && trigger.current) {
                    observer.unobserve(trigger.current); // 관찰 종료
                    const newProducts = await getMoreProducts(page + 1);
                    if (newProducts.length !== 0) {
                        setPage((prev) => prev + 1);
                        setProducts((prev) => [...prev, ...newProducts]);
                    } else {
                        setIsLastPage(true);
                    }
                }
            },
            {
                threshold: 1.0, // 관찰 대상이 100% 보여야 isIntersecting 변경
            },
        );

        if (trigger.current) {
            observer.observe(trigger.current); // 관찰 시작
        }

        return () => {
            observer.disconnect(); // 옵저버 정리
        };
    }, [page]);

    return (
        <div className="flex flex-col gap-5 p-5">
            {products.map((product) => (
                <ListProduct key={product.id} {...product} />
            ))}
            {isLastPage ? null : (
                <span
                    ref={trigger}
                    className="mx-auto hidden w-fit rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold hover:opacity-90 active:scale-95"
                />
            )}
        </div>
    );
}
