"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, Heart, CheckCircle, Truck, RotateCcw, CreditCard } from "lucide-react";
import { usePriceFormatter } from "@/hooks/useCurrency";
import type { Product, PlatingOption } from "@/types/product";
import { fixUploadcareUrl } from "@/lib/fix-uploadcare-url";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const SizeGuideModal = dynamic(() => import("@/components/ui/SizeGuideModal"), {
  ssr: false,
});

// Standard plating options for jewelry (925 Sterling Silver base)
const STANDARD_PLATING_OPTIONS: PlatingOption[] = [
	{ type: "none", label: "Sterling Silver (925)", priceAdjustment: 0, available: true },
	{ type: "24k-gold", label: "24K Gold Plated", priceAdjustment: 5000, available: true },
	{ type: "18k-rose-gold", label: "18K Rose Gold Plated", priceAdjustment: 3000, available: true },
];

interface ProductDetailOneProps {
	product: Product;
	onAddToCart?: (product: Product, options: { plating?: PlatingOption; quantity: number }) => void;
}

export function ProductDetailOne({ product, onAddToCart }: ProductDetailOneProps) {
	const { formatPrice } = usePriceFormatter() as any;
	const router = useRouter();
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [selectedPlating, setSelectedPlating] = useState<PlatingOption>(
		product.plating?.[0] || STANDARD_PLATING_OPTIONS[0]
	);
	const [quantity, setQuantity] = useState(1);
	const [showSizeGuide, setShowSizeGuide] = useState(false);

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
	const finalPrice = product.price + selectedPlating.priceAdjustment;

	const handleAddToCart = () => {
		onAddToCart?.(product, { plating: selectedPlating, quantity });
	};

	const handleBuyNow = () => {
		onAddToCart?.(product, { plating: selectedPlating, quantity });
		router.push('/checkout');
	};

	// Get plating label - if it's "none", use product's base material or default
	const getPlatingLabel = (plating: PlatingOption) => {
		if (plating.type === "none") {
			// Use product's material if available, otherwise use label
			if (product.materials && product.materials.length > 0) {
				return product.materials.join(", ");
			}
			return plating.label || "Sterling Silver (925)";
		}
		return plating.label || plating.type;
	};

	return (
		<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 not-prose">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
				{/* Image Section */}
				<div className="space-y-4">
					{/* Main image */}
					<div className="relative aspect-square bg-white border border-metal-gold/10 rounded-2xl overflow-hidden shadow-subtle">
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
					{/* Category */}
					<p className="text-xs uppercase tracking-wider text-deep-black/60">
						{product.category.replace('-', ' ')}
					</p>

					{/* Title */}
					<h1 className="font-serif text-3xl lg:text-4xl font-normal text-deep-black leading-tight">
						{product.name}
					</h1>

					{/* Price & Wishlist */}
					<div className="flex items-center justify-between">
						<p className="text-3xl font-semibold text-deep-black">
							{formatPrice(finalPrice)}
						</p>
						<WishlistButton product={product} />
					</div>

					{/* Description */}
					<p className="text-deep-black/70 leading-relaxed">
						{product.description}
					</p>

					{/* Plating Options - Dropdown */}
					<div>
						<div className="flex items-center justify-between mb-3">
							<label htmlFor="plating-select" className="block text-sm font-medium text-deep-black">
								Materials
							</label>
							<button
								type="button"
								onClick={() => setShowSizeGuide(true)}
								className="text-xs font-medium text-deep-black/60 hover:text-foreground underline underline-offset-2 transition-colors flex items-center gap-1"
							>
								<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
								Size Guide
							</button>
						</div>
						<div className="relative">
							<select
								id="plating-select"
								value={selectedPlating.type}
								onChange={(e) => {
									const selected = platingOptions.find(p => p.type === e.target.value)
									if (selected) setSelectedPlating(selected)
								}}
								className="w-full px-4 py-3 pr-10 rounded-lg border border-metal-gold/20 bg-white text-deep-black font-medium focus:border-metal-gold focus:outline-none focus:ring-2 focus:ring-metal-gold/20 transition-all cursor-pointer hover:border-metal-gold/40 appearance-none"
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

					{/* Quantity */}
					<div>
						<label className="block text-sm font-medium mb-3 text-deep-black">Quantity</label>
						<div className="flex items-center gap-2 sm:gap-3">
							<button
								onClick={decrementQuantity}
								disabled={quantity <= 1}
								className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								aria-label="Decrease quantity"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
								</svg>
							</button>
							<span className="w-12 text-center font-medium">{quantity}</span>
							<button
								onClick={incrementQuantity}
								className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center transition-colors"
								aria-label="Increase quantity"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
								</svg>
							</button>
						</div>
					</div>

					{/* Action Buttons - Side by Side */}
					<div className="flex gap-3">
						{/* Add to Cart Button */}
						<button
							onClick={handleAddToCart}
							className="flex-1 rounded-full bg-deep-black py-3.5 px-6 text-sm font-semibold tracking-wider text-white transition-all duration-300 hover:bg-forest-deep flex items-center justify-center gap-2"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
							</svg>
							Add to Cart
						</button>

						{/* Buy Now Button */}
						<button
							onClick={handleBuyNow}
							className="flex-1 rounded-full border-2 border-deep-black py-3.5 px-6 text-sm font-semibold tracking-wider text-deep-black transition-all duration-300 hover:bg-deep-black hover:text-white"
						>
							Buy Now
						</button>
					</div>

					{/* Feature Badges - Like modal */}
					<div className="grid grid-cols-2 gap-4 pt-6 border-t border-metal-gold/10">
						<div className="flex items-center gap-2 text-sm text-deep-black/70">
							<CheckCircle className="w-4 h-4 flex-shrink-0" />
							<span>Authentic Gemstones</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-deep-black/70">
							<CreditCard className="w-4 h-4 flex-shrink-0" />
							<span>Secure Payment</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-deep-black/70">
							<Truck className="w-4 h-4 flex-shrink-0" />
							<span>Free Shipping (SL)</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-deep-black/70">
							<RotateCcw className="w-4 h-4 flex-shrink-0" />
							<span>Easy Returns</span>
						</div>
					</div>
				</div>
			</div>

			{/* Size Guide Modal */}
			<SizeGuideModal
				isOpen={showSizeGuide}
				onClose={() => setShowSizeGuide(false)}
				category={product.category}
			/>
		</div>
	);
}
