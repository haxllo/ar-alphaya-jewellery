"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { usePriceFormatter } from "@/hooks/useCurrency";
import type { Product, PlatingOption } from "@/types/product";
import { fixUploadcareUrl } from "@/lib/fix-uploadcare-url";

// Standard plating options for jewelry (925 Sterling Silver base)
const STANDARD_PLATING_OPTIONS: PlatingOption[] = [
	{ type: "Silver", priceAdjustment: 0, available: true }, // 925 Sterling Silver (base)
	{ type: "Gold", priceAdjustment: 50000, available: true }, // 24K Gold Plated (+LKR 500)
	{ type: "Rose Gold", priceAdjustment: 50000, available: true }, // 18K Rose Gold Plated (+LKR 500)
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

	return (
		<div className="w-full max-w-6xl mx-auto p-6 not-prose bg-amber-mirage-soft/50">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
				{/* Image Section */}
				<div className="flex gap-2">
					<div className="flex flex-col w-28 gap-2">
						{images.slice(0, 4).map((image, index) => (
							<button
								key={index}
								onClick={() => setCurrentImageIndex(index)}
								className={cn(
									"aspect-square bg-amber-mirage-100 rounded-lg overflow-hidden border-2 transition-colors",
									currentImageIndex === index
										? "border-amber-mirage-gold"
										: "border-transparent hover:border-amber-mirage-300",
								)}
							>
								<Image
									src={fixUploadcareUrl(image)}
									alt={`${product.name} ${index + 1}`}
									width={112}
									height={112}
									className="w-full h-full object-cover"
								/>
							</button>
						))}
					</div>

					<div className="flex-1 relative aspect-[3/4] bg-amber-mirage-100 rounded-lg overflow-hidden border border-amber-mirage-200">
						{images.length > 0 ? (
							<Image
								src={fixUploadcareUrl(images[currentImageIndex])}
								alt={product.name}
								fill
								className="object-cover"
								sizes="(max-width: 768px) 100vw, 50vw"
								priority
							/>
						) : (
							<div className="flex items-center justify-center h-full text-amber-mirage-400">
								No image available
							</div>
						)}

						{/* Navigation Arrows */}
						{images.length > 1 && (
							<>
								<Button
									variant="outline"
									size="icon"
									className="absolute left-4 top-1/2 -translate-y-1/2 bg-amber-mirage-soft/80 backdrop-blur-sm rounded-full border-amber-mirage-300 hover:bg-amber-mirage-warm/20"
									onClick={prevImage}
								>
									<ChevronLeftIcon className="w-4 h-4 text-amber-mirage-brown" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									className="absolute right-4 top-1/2 -translate-y-1/2 bg-amber-mirage-soft/80 backdrop-blur-sm rounded-full border-amber-mirage-300 hover:bg-amber-mirage-warm/20"
									onClick={nextImage}
								>
									<ChevronRightIcon className="w-4 h-4 text-amber-mirage-brown" />
								</Button>
							</>
						)}
					</div>
				</div>

				{/* Product Info Section */}
				<div className="space-y-6">
					<div>
						<a
							href={`/collections/${product.category}`}
							className="text-amber-mirage-600 hover:text-amber-mirage-gold inline-block mb-2 text-sm uppercase tracking-wider"
						>
							{product.category.replace('-', ' ')}
						</a>
						<h1 className="text-3xl font-bold text-amber-mirage-brown">{product.name}</h1>
						<p className="text-amber-mirage-700 mt-2">{product.description}</p>
					</div>

					<div className="flex items-end gap-2">
						<p className="text-3xl font-bold text-amber-mirage-brown">
							{formatPrice(finalPrice)}
						</p>
						{selectedPlating.priceAdjustment && selectedPlating.priceAdjustment > 0 && (
							<p className="text-amber-mirage-600 text-sm mb-1">
								(+{formatPrice(selectedPlating.priceAdjustment)} for {selectedPlating.type} plating)
							</p>
						)}
					</div>

					{/* Materials */}
					{product.materials && product.materials.length > 0 && (
						<div className="p-4 bg-amber-mirage-100 rounded-lg border border-amber-mirage-200">
							<h3 className="text-sm font-semibold text-amber-mirage-brown uppercase tracking-wider mb-2">
								Materials
							</h3>
							<p className="text-sm text-amber-mirage-700">{product.materials.join(", ")}</p>
						</div>
					)}

					{/* Plating Options */}
					<div>
						<h3 className="text-sm font-semibold text-amber-mirage-brown uppercase tracking-wider mb-3">
							Plating Finish (925 Sterling Silver Base)
						</h3>
						<div className="grid grid-cols-3 gap-3">
							{platingOptions.map((plating) => (
								<Button
									key={plating.type}
									variant={selectedPlating.type === plating.type ? "default" : "outline"}
									size="sm"
									onClick={() => setSelectedPlating(plating)}
									disabled={!plating.available}
									className={cn(
										"relative",
										selectedPlating.type === plating.type
											? "bg-amber-mirage-gold hover:bg-amber-mirage-600 text-amber-mirage-soft border-amber-mirage-gold"
											: "border-amber-mirage-300 text-amber-mirage-brown hover:bg-amber-mirage-warm/10"
									)}
								>
									<span className="flex flex-col items-center">
										<span className="text-sm">{plating.type === "Silver" ? "925 Silver" : plating.type === "Gold" ? "24K Gold" : "18K Rose Gold"}</span>
										{plating.priceAdjustment && plating.priceAdjustment > 0 && (
											<span className="text-xs opacity-75">
												+{formatPrice(plating.priceAdjustment)}
											</span>
										)}
									</span>
								</Button>
							))}
						</div>
						<p className="text-xs text-amber-mirage-600 mt-2">
							All pieces are crafted in 925 Sterling Silver. Choose your preferred plating finish.
						</p>
					</div>

					{/* Quantity Selector */}
					<div className="flex items-center gap-4">
						<div className="flex items-center border border-amber-mirage-300 rounded-lg bg-amber-mirage-soft">
							<Button
								variant="ghost"
								size="icon"
								className="h-10 w-10 rounded-lg hover:bg-amber-mirage-warm/10 text-amber-mirage-brown"
								onClick={decrementQuantity}
							>
								<MinusIcon className="w-4 h-4" />
							</Button>
							<span className="w-12 text-center font-medium text-amber-mirage-brown">{quantity}</span>
							<Button
								variant="ghost"
								size="icon"
								className="h-10 w-10 rounded-lg hover:bg-amber-mirage-warm/10 text-amber-mirage-brown"
								onClick={incrementQuantity}
							>
								<PlusIcon className="w-4 h-4" />
							</Button>
						</div>
						<Button 
							size="lg" 
							onClick={handleAddToCart}
							className="flex-1 bg-amber-mirage-gold hover:bg-amber-mirage-600 text-amber-mirage-soft"
						>
							Add to cart
						</Button>
					</div>

					{/* Stock Status */}
					{product.inStock === false && (
						<div className="p-4 bg-amber-mirage-warm/10 border border-amber-mirage-warm rounded-lg">
							<p className="text-sm text-amber-mirage-brown font-medium">
								Made to order • {product.leadTime || "4-6 weeks production time"}
							</p>
						</div>
					)}

					{/* Additional Details */}
					{product.statusNote && (
						<div className="p-4 bg-amber-mirage-100 rounded-lg border border-amber-mirage-200">
							<p className="text-sm text-amber-mirage-700">{product.statusNote}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
