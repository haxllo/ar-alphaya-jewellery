'use client'

import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePriceFormatter } from "@/hooks/useCurrency";
import { useWishlistStore } from "@/lib/store/wishlist";
import type { Product } from "@/types/product";
import { fixUploadcareUrl } from "@/lib/fix-uploadcare-url";

interface ProductCardOneProps {
	product: Product;
	onAddToCart?: (product: Product) => void;
}

export function ProductCardOne({ product, onAddToCart }: ProductCardOneProps) {
	const { formatPrice } = usePriceFormatter() as any;
	const { addItem, removeItem, isInWishlist } = useWishlistStore();
	const isFavorited = isInWishlist(product.id);

	const handleWishlistToggle = () => {
		if (isFavorited) {
			removeItem(product.id);
		} else {
			addItem(product);
		}
	};

	return (
		<Card className="w-full max-w-[320px] border-amber-mirage-200 bg-amber-mirage-soft/80 shadow-amber transition-all duration-300 hover:-translate-y-1 hover:shadow-luxe">
			<CardContent className="p-4">
				{/* Product Image */}
				<Link href={`/products/${product.slug}`} className="block relative mb-4">
					<div className="bg-amber-mirage-100 rounded-2xl flex items-center justify-center h-[280px] relative overflow-hidden border border-amber-mirage-200">
						{product.images && product.images[0] ? (
							<Image
								src={fixUploadcareUrl(product.images[0])}
								alt={product.name}
								fill
								className="object-cover transition-transform duration-300 hover:scale-105"
								sizes="(max-width: 768px) 100vw, 320px"
							/>
						) : (
							<div className="text-amber-mirage-400 text-sm">No image</div>
						)}

						<Button
							variant="ghost"
							size="icon"
							onClick={(e) => {
								e.preventDefault();
								handleWishlistToggle();
							}}
							className="absolute top-2 right-2 bg-amber-mirage-soft/90 hover:bg-amber-mirage-warm/20"
							aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
						>
							<Heart
								className={cn(
									"w-5 h-5 transition-colors",
									isFavorited
										? "fill-amber-mirage-gold text-amber-mirage-gold"
										: "text-amber-mirage-brown hover:text-amber-mirage-gold",
								)}
							/>
						</Button>

						{product.featured && (
							<div className="absolute top-2 left-2 bg-amber-mirage-gold text-amber-mirage-soft px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
								Featured
							</div>
						)}
					</div>
				</Link>

				{/* Product Info */}
				<div className="mb-4">
					<Link href={`/products/${product.slug}`}>
						<CardTitle className="text-lg leading-tight mb-2 text-amber-mirage-brown hover:text-amber-mirage-gold transition-colors line-clamp-2">
							{product.name}
						</CardTitle>
					</Link>
					<CardDescription className="text-sm text-amber-mirage-700 line-clamp-2">
						{product.description}
					</CardDescription>
					{product.materials && product.materials.length > 0 && (
						<p className="text-xs text-amber-mirage-600 mt-1">
							{product.materials.slice(0, 2).join(", ")}
						</p>
					)}
				</div>

				<div className="flex items-center justify-between gap-2">
					<p className="text-xl sm:text-2xl font-bold text-amber-mirage-brown">
						{formatPrice(product.price)}
					</p>

					<Button 
						onClick={() => onAddToCart?.(product)}
						size="icon"
						className="bg-amber-mirage-gold hover:bg-amber-mirage-600 text-amber-mirage-soft shrink-0"
						aria-label="Add to cart"
						title="Add to cart"
					>
						<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
