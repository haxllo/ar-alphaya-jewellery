"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, MinusIcon, PlusIcon, Share2 } from "lucide-react";
import { usePriceFormatter } from "@/hooks/useCurrency";
import type { Product, PlatingOption } from "@/types/product";
import { fixUploadcareUrl } from "@/lib/fix-uploadcare-url";

// Standard plating options for jewelry (925 Sterling Silver base)
const STANDARD_PLATING_OPTIONS: PlatingOption[] = [
	{ type: "925-silver", label: "None (925 Sterling Silver)", priceAdjustment: 0, available: true },
	{ type: "24k-gold", label: "24K Gold Plated", priceAdjustment: 5000, available: true },
	{ type: "18k-rose-gold", label: "18K Rose Gold Plated", priceAdjustment: 3000, available: true },
];

interface ProductDetailOneProps {
	product: Product;
	onAddToCart?: (product: Product, options: { plating?: PlatingOption; quantity: number }) => void;
}

export function ProductDetailOne({ product, onAddToCart }: ProductDetailOneProps) {
	const { formatPrice } = usePriceFormatter() as any;
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [selectedPlating, setSelectedPlating] = useState<PlatingOption>(
		product.plating?.[0] || STANDARD_PLATING_OPTIONS[0]
	);
	const [quantity, setQuantity] = useState(1);

	// Use product plating options if available, otherwise use standard
	const platingOptions = product.plating && product.plating.length > 0 
		? product.plating 
		: STANDARD_PLATING_OPTIONS;

	const images = product.images && product.images.length > 0 ? product.images : [];

	const nextImage = () => {
		if (images.length > 0) {
			setCurrentImageIndex((prev) => (prev + 1) % images.length);
		}
	};

	const prevImage = () => {
		if (images.length > 0) {
			setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
		}
	};

	const incrementQuantity = () => setQuantity((prev) => prev + 1);
	const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

	// Calculate final price including plating adjustment
	const finalPrice = product.price + (selectedPlating.priceAdjustment || 0);

	const handleAddToCart = () => {
		onAddToCart?.(product, { plating: selectedPlating, quantity });
	};

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: product.name,
					text: product.description,
					url: window.location.href,
				});
			} catch (err) {
				console.log('Share cancelled');
			}
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(window.location.href);
			alert('Link copied to clipboard!');
		}
	};

	// Helper function to format plating option text
	const getPlatingLabel = (plating: PlatingOption) => {
		return plating.label || plating.type;
	};

	return (
		<div className="w-full max-w-6xl mx-auto px-6 py-14 not-prose">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
				{/* Image Section */}
				<div className="space-y-4">
					{/* Main image */}
					<div className="relative aspect-[4/5] bg-white border border-metal-gold/10 rounded-2xl overflow-hidden shadow-subtle">
						{images.length > 0 ? (
							<Image
								src={fixUploadcareUrl(images[currentImageIndex])}
								alt={product.name}
								fill
								className="object-contain"
								sizes="(max-width: 768px) 100vw, 50vw"
								priority
							/>
						) : (
							<div className="flex items-center justify-center h-full text-deep-black/30">
								No image available
							</div>
						)}

						{/* Navigation Arrows */}
						{images.length > 1 && (
							<>
								<button
									onClick={prevImage}
									className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-metal-gold/20 hover:border-metal-gold rounded-full h-10 w-10 flex items-center justify-center shadow-subtle transition-all"
								>
									<ChevronLeftIcon className="w-5 h-5 text-deep-black" />
								</button>
								<button
									onClick={nextImage}
									className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-metal-gold/20 hover:border-metal-gold rounded-full h-10 w-10 flex items-center justify-center shadow-subtle transition-all"
								>
									<ChevronRightIcon className="w-5 h-5 text-deep-black" />
								</button>
							</>
						)}
					</div>

					{/* Thumbnail Row */}
					<div className="flex gap-3 overflow-x-auto pb-2 thumbnail-scroll">
						{images.map((image, index) => (
							<button
								key={index}
								onClick={() => setCurrentImageIndex(index)}
								className={cn(
									"flex-shrink-0 aspect-square w-20 bg-white rounded-xl overflow-hidden border-2 transition-colors shadow-subtle",
									currentImageIndex === index
										? "border-metal-gold"
										: "border-metal-gold/10 hover:border-metal-gold/30",
								)}
							>
								<Image
									src={fixUploadcareUrl(image)}
									alt={`${product.name} ${index + 1}`}
									width={80}
									height={80}
									className="w-full h-full object-contain p-1"
								/>
							</button>
						))}
					</div>
				</div>

				{/* Product Info Section */}
				<div className="space-y-6">
					{/* Category & Title */}
					<div>
						<a
							href={`/collections/${product.category}`}
							className="text-deep-black/40 hover:text-metal-gold inline-block mb-2 text-xs uppercase tracking-wider transition-colors"
						>
							{product.category.replace('-', ' ')}
						</a>
						<h1 className="font-serif text-3xl font-normal mb-3 text-deep-black">{product.name}</h1>
						
						{/* Description at top */}
						<p className="text-deep-black/70 leading-relaxed">{product.description}</p>
					</div>

					{/* Price */}
					<div className="flex items-end gap-3">
						<p className="text-3xl font-semibold text-deep-black">
							{formatPrice(finalPrice)}
						</p>
						{selectedPlating.priceAdjustment && selectedPlating.priceAdjustment > 0 && (
							<p className="text-deep-black/50 line-through text-xl mb-1">
								{formatPrice(product.price)}
							</p>
						)}
					</div>

					{/* Plating Options */}
					<div>
						<label htmlFor="plating-select" className="block text-sm font-medium mb-3 text-deep-black">
							Plating Options
						</label>
						<div className="relative">
							<select
								id="plating-select"
								value={selectedPlating.type}
								onChange={(e) => {
									const selected = platingOptions.find(p => p.type === e.target.value)
									if (selected) setSelectedPlating(selected)
								}}
								className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-metal-gold/20 bg-white text-deep-black font-medium focus:border-metal-gold focus:outline-none focus:ring-2 focus:ring-metal-gold/20 transition-all cursor-pointer hover:border-metal-gold/40 appearance-none"
							>
								{platingOptions.map((plating) => (
									<option 
										key={plating.type} 
										value={plating.type}
										disabled={!plating.available}
									>
										{getPlatingLabel(plating)}
										{plating.priceAdjustment > 0 && ` (+${formatPrice(plating.priceAdjustment)})`}
									</option>
								))}
							</select>
							{/* Custom Dropdown Arrow */}
							<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-deep-black/50">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</div>
						</div>
					</div>

					{/* Materials - if available */}
					{product.materials && product.materials.length > 0 && (
						<div>
							<h3 className="text-sm font-medium mb-2 text-deep-black">Metal</h3>
							<p className="text-sm text-deep-black/70">{product.materials.join(", ")}</p>
						</div>
					)}

					{/* Quantity & Add to Cart */}
					<div className="space-y-3">
						<h3 className="text-sm font-medium text-deep-black">Quantity</h3>
						<div className="flex items-center gap-4">
							<div className="flex items-center border border-metal-gold/20 rounded-xl">
								<button
									onClick={decrementQuantity}
									className="h-10 w-10 rounded-xl hover:bg-neutral-soft transition-colors flex items-center justify-center"
								>
									<MinusIcon className="w-4 h-4 text-deep-black" />
								</button>
								<span className="w-12 text-center font-medium text-deep-black">{quantity}</span>
								<button
									onClick={incrementQuantity}
									className="h-10 w-10 rounded-xl hover:bg-neutral-soft transition-colors flex items-center justify-center"
								>
									<PlusIcon className="w-4 h-4 text-deep-black" />
								</button>
							</div>
							<button
								onClick={handleAddToCart}
								className="flex-1 rounded-full bg-metal-gold py-3 px-6 text-sm font-semibold tracking-wider text-neutral-soft transition-all duration-300 hover:bg-forest-deep hover:-translate-y-0.5"
							>
								Add to cart
							</button>
						</div>
					</div>

					{/* Buy it now button - optional */}
					<button
						onClick={handleAddToCart}
						className="w-full rounded-full border border-metal-gold/20 py-3 px-6 text-sm font-semibold tracking-wider text-deep-black transition-all duration-300 hover:border-metal-gold hover:-translate-y-0.5"
					>
						Buy it now
					</button>

					{/* Share button */}
					<button
						onClick={handleShare}
						className="flex items-center gap-2 text-sm text-deep-black/50 hover:text-metal-gold transition-colors"
					>
						<Share2 className="w-4 h-4" />
						Share
					</button>

					{/* Additional info - badges/icons like your example */}
					{(product.statusNote || product.inStock === false || product.customizable) && (
						<div className="space-y-2 pt-6 border-t border-metal-gold/20">
							{product.statusNote && (
								<div className="flex items-start gap-2 text-sm text-deep-black/70">
									<span>✨</span>
									<span>{product.statusNote}</span>
								</div>
							)}
							{product.inStock === false && (
								<div className="flex items-start gap-2 text-sm text-deep-black/70">
									<span>💎</span>
									<span>Made to order • {product.leadTime || "4-6 weeks production time"}</span>
								</div>
							)}
							{product.customizable !== false && (
								<div className="flex items-start gap-2 text-sm text-deep-black/70">
									<span>🎨</span>
									<span>Handcrafted with care</span>
								</div>
							)}
							<div className="flex items-start gap-2 text-sm text-deep-black/70">
								<span>♾️</span>
								<span>Lifetime silver warranty</span>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
