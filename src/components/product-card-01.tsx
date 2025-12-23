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
		// Border Radius Formula: Inner + Padding = Outer
		// Card outer: 24px (rounded-2xl) | Padding: 20px (p-5) | Image inner: 8px (rounded-lg)
		<Card className="w-full border-metal-gold/20 bg-white/80 shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:shadow-luxe hover:scale-[1.02] rounded-2xl">
			<CardContent className="p-3 sm:p-5">
				{/* Product Image */}
				<Link href={`/products/${product.slug}`} className="block relative mb-3 sm:mb-4">
					<div className="bg-neutral-soft rounded-lg flex items-center justify-center h-[180px] sm:h-[280px] relative overflow-hidden border border-metal-gold/10">
						{product.images && product.images[0] ? (
							<Image
								src={fixUploadcareUrl(product.images[0])}
								alt={product.name}
								fill
								className="object-cover transition-transform duration-300 hover:scale-105"
								sizes="(max-width: 640px) 50vw, 320px"
							/>
						) : (
							<div className="text-deep-black/30 text-sm">No image</div>
						)}

						<Button
							variant="ghost"
							size="icon"
							onClick={(e) => {
								e.preventDefault();
								handleWishlistToggle();
							}}
							className="absolute top-2 right-2 bg-white/90 hover:bg-white transition-all h-8 w-8 sm:h-10 sm:w-10"
							aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
						>
							<Heart
								className={cn(
									"w-4 h-4 sm:w-5 sm:h-5 transition-all",
									isFavorited
										? "fill-metal-gold text-metal-gold scale-110"
										: "text-deep-black/60 hover:text-metal-gold hover:scale-110",
								)}
							/>
						</Button>

						{product.featured && (
							<div className="absolute top-2 left-2 bg-metal-gold text-deep-black px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-semibold uppercase tracking-wider">
								Featured
							</div>
						)}
					</div>
				</Link>

				{/* Product Info */}
				<div className="mb-2 sm:mb-4 space-y-1 sm:space-y-2">
					<Link href={`/products/${product.slug}`}>
						<CardTitle className="text-sm sm:text-lg leading-tight text-deep-black hover:text-metal-gold transition-colors line-clamp-2 font-serif font-normal">
							{product.name}
						</CardTitle>
					</Link>
					{product.materials && product.materials.length > 0 && (
						<p className="text-[10px] sm:text-xs text-deep-black/40">
							{product.materials.slice(0, 2).join(", ")}
						</p>
					)}
				</div>

				<div className="flex items-center justify-between gap-2">
					<p className="text-base sm:text-2xl font-semibold text-deep-black">
						{formatPrice(product.price)}
					</p>

					<Button 
						onClick={() => onAddToCart?.(product)}
						size="icon"
						className="bg-deep-black hover:bg-forest-deep text-white shrink-0 transition-all h-8 w-8 sm:h-10 sm:w-10"
						aria-label="Add to cart"
						title="Add to cart"
					>
						<svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
						</svg>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
