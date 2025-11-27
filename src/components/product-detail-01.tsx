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
		<div className="w-full max-w-6xl mx-auto p-6 not-prose">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
				{/* Image Section */}
				<div className="flex flex-col gap-4">
					{/* Main image */}
					<div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
						{images.length > 0 ? (
							<Image
								src={fixUploadcareUrl(images[currentImageIndex])}
								alt={product.name}
								width={600}
								height={600}
								className="object-cover w-full h-full"
								sizes="(max-width: 768px) 100vw, 50vw"
								priority
							/>
						) : (
							<div className="flex items-center justify-center h-full text-gray-400">
								No image available
							</div>
						)}

						{/* Navigation Arrows */}
						{images.length > 1 && (
							<>
								<Button
									variant="outline"
									size="icon"
									className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full"
									onClick={prevImage}
								>
									<ChevronLeftIcon className="w-4 h-4" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full"
									onClick={nextImage}
								>
									<ChevronRightIcon className="w-4 h-4" />
								</Button>
							</>
						)}
					</div>

					{/* Thumbnail row */}
					{images.length > 1 && (
						<div className="flex gap-2 overflow-x-auto pb-2">
							{images.map((image, index) => (
								<button
									key={index}
									onClick={() => setCurrentImageIndex(index)}
									className={cn(
										"flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors",
										currentImageIndex === index
											? "border-amber-mirage-gold"
											: "border-transparent hover:border-gray-300",
									)}
								>
									<Image
										src={fixUploadcareUrl(image)}
										alt={`${product.name} ${index + 1}`}
										width={80}
										height={80}
										className="w-full h-full object-cover"
									/>
								</button>
							))}
						</div>
					)}
				</div>

				{/* Product Info Section */}
				<div className="space-y-6">
					{/* Category & Title */}
					<div>
						<a
							href={`/collections/${product.category}`}
							className="text-muted-foreground hover:text-gray-900 inline-block mb-2 text-sm uppercase tracking-wider"
						>
							{product.category.replace('-', ' ')}
						</a>
						<h1 className="text-3xl font-bold mb-3">{product.name}</h1>
						
						{/* Description at top */}
						<p className="text-muted-foreground leading-relaxed">{product.description}</p>
					</div>

					{/* Price */}
					<div className="flex items-end gap-3">
						<p className="text-3xl font-bold">
							{formatPrice(finalPrice)}
						</p>
						{(selectedPlating.priceAdjustment || 0) > 0 && (
							<p className="text-gray-500 line-through text-xl mb-1">
								{formatPrice(product.price)}
							</p>
						)}
					</div>

					{/* Plating Options */}
					<div>
						<h3 className="text-sm font-medium mb-3">Plating Options</h3>
						<div className="space-y-2">
							{platingOptions.map((plating) => (
								<button
									key={plating.type}
									onClick={() => setSelectedPlating(plating)}
									disabled={!plating.available}
									className={cn(
										"w-full text-left px-4 py-3 rounded-lg border-2 transition-all",
										selectedPlating.type === plating.type
											? "border-gray-900 bg-gray-50"
											: "border-gray-200 hover:border-gray-300",
										!plating.available && "opacity-50 cursor-not-allowed"
									)}
								>
									<div className="flex items-center justify-between">
										<span className="font-medium">{getPlatingLabel(plating)}</span>
										{(plating.priceAdjustment || 0) > 0 && (
											<span className="text-sm text-gray-600">
												+{formatPrice(plating.priceAdjustment)}
											</span>
										)}
									</div>
								</button>
							))}
						</div>
					</div>

					{/* Materials - if available */}
					{product.materials && product.materials.length > 0 && (
						<div>
							<h3 className="text-sm font-medium mb-2">Metal</h3>
							<p className="text-sm text-muted-foreground">{product.materials.join(", ")}</p>
						</div>
					)}

					{/* Quantity & Add to Cart */}
					<div className="space-y-3">
						<h3 className="text-sm font-medium">Quantity</h3>
						<div className="flex items-center gap-4">
							<div className="flex items-center border border-gray-300 rounded-lg">
								<Button
									variant="ghost"
									size="icon"
									className="h-10 w-10 rounded-lg hover:bg-gray-100"
									onClick={decrementQuantity}
								>
									<MinusIcon className="w-4 h-4" />
								</Button>
								<span className="w-12 text-center font-medium">{quantity}</span>
								<Button
									variant="ghost"
									size="icon"
									className="h-10 w-10 rounded-lg hover:bg-gray-100"
									onClick={incrementQuantity}
								>
									<PlusIcon className="w-4 h-4" />
								</Button>
							</div>
							<Button 
								size="lg" 
								onClick={handleAddToCart}
								className="flex-1"
							>
								Add to cart
							</Button>
						</div>
					</div>

					{/* Buy it now button - optional */}
					<Button 
						size="lg" 
						variant="outline"
						className="w-full"
						onClick={handleAddToCart}
					>
						Buy it now
					</Button>

					{/* Share button */}
					<button
						onClick={handleShare}
						className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gray-900 transition-colors"
					>
						<Share2 className="w-4 h-4" />
						Share
					</button>

					{/* Additional info - badges/icons like your example */}
					{(product.statusNote || product.inStock === false || product.customizable) && (
						<div className="space-y-2 pt-4 border-t">
							{product.statusNote && (
								<div className="flex items-start gap-2 text-sm text-muted-foreground">
									<span>✨</span>
									<span>{product.statusNote}</span>
								</div>
							)}
							{product.inStock === false && (
								<div className="flex items-start gap-2 text-sm text-muted-foreground">
									<span>💎</span>
									<span>Made to order • {product.leadTime || "4-6 weeks production time"}</span>
								</div>
							)}
							{product.customizable !== false && (
								<div className="flex items-start gap-2 text-sm text-muted-foreground">
									<span>🎨</span>
									<span>Handcrafted with care</span>
								</div>
							)}
							<div className="flex items-start gap-2 text-sm text-muted-foreground">
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
