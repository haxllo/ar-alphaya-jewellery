"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, MinusIcon, PlusIcon, Heart, CheckCircle, Truck, RotateCcw, CreditCard } from "lucide-react";
import { usePriceFormatter } from "@/hooks/useCurrency";
import type { Product, PlatingOption } from "@/types/product";
import { fixUploadcareUrl } from "@/lib/fix-uploadcare-url";

// Standard plating options for jewelry (925 Sterling Silver base)
const STANDARD_PLATING_OPTIONS: PlatingOption[] = [
	{ type: "925-silver", label: "925 Silver", priceAdjustment: 0, available: true },
	{ type: "24k-gold", label: "24K Gold", priceAdjustment: 5000, available: true },
	{ type: "18k-rose-gold", label: "18K Rose Gold", priceAdjustment: 3000, available: true },
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
	const finalPrice = product.price + selectedPlating.priceAdjustment;

	const handleAddToCart = () => {
		onAddToCart?.(product, { plating: selectedPlating, quantity });
	};

	// Get short plating label for button display
	const getShortPlatingLabel = (plating: PlatingOption) => {
		const label = plating.label || plating.type;
		// Extract the key part (e.g., "925 Silver", "24K Gold", "18K Rose Gold")
		return label.replace(/None \(|\)| Plated/g, '').trim();
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

					{/* Price */}
					<div className="flex items-center gap-3">
						<p className="text-3xl font-semibold text-deep-black">
							{formatPrice(finalPrice)}
						</p>
						<Heart className="w-5 h-5 text-deep-black/40 hover:text-metal-gold cursor-pointer transition-colors" />
					</div>

					{/* Description */}
					<p className="text-deep-black/70 leading-relaxed">
						{product.description}
					</p>

					{/* Plating Options - Dropdown */}
					<div>
						<label htmlFor="plating-select" className="block text-sm font-medium mb-3 text-deep-black">
							Materials
						</label>
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
										{getShortPlatingLabel(plating)}
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
						<h3 className="text-sm font-medium mb-3 text-deep-black">Quantity</h3>
						<div className="flex items-center border border-metal-gold/20 rounded-lg w-fit">
							<button
								onClick={decrementQuantity}
								className="h-12 w-12 hover:bg-neutral-soft transition-colors flex items-center justify-center"
								aria-label="Decrease quantity"
							>
								<MinusIcon className="w-4 h-4 text-deep-black" />
							</button>
							<span className="w-16 text-center font-medium text-deep-black">{quantity}</span>
							<button
								onClick={incrementQuantity}
								className="h-12 w-12 hover:bg-neutral-soft transition-colors flex items-center justify-center"
								aria-label="Increase quantity"
							>
								<PlusIcon className="w-4 h-4 text-deep-black" />
							</button>
						</div>
					</div>

					{/* Add to Cart Button */}
					<button
						onClick={handleAddToCart}
						className="w-full rounded-full bg-deep-black py-3.5 px-6 text-sm font-semibold tracking-wider text-white transition-all duration-300 hover:bg-forest-deep flex items-center justify-center gap-2"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
						</svg>
						Add to Cart
					</button>

					{/* View Full Details Button */}
					<button
						className="w-full rounded-full border border-deep-black/20 py-3.5 px-6 text-sm font-semibold tracking-wider text-deep-black transition-all duration-300 hover:border-deep-black"
					>
						View Full Details
					</button>

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
		</div>
	);
}
