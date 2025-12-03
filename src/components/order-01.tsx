"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePriceFormatter } from "@/hooks/useCurrency";
import { fixUploadcareUrl } from "@/lib/fix-uploadcare-url";

interface OrderItem {
	id: string;
	productId: string;
	name: string;
	image?: string;
	price: number;
	quantity: number;
	description?: string;
}

interface Order {
	id: string;
	orderNumber: string;
	status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
	orderDate: string;
	deliveryDate?: string;
	items: OrderItem[];
	paymentMethod: string;
	total: number;
}

interface OrderOneProps {
	order: Order;
	onDownloadInvoice?: (orderId: string) => void;
}

const STATUS_COLORS = {
	pending: "bg-metal-gold/20 text-deep-black",
	processing: "bg-blue-100 text-blue-700",
	shipped: "bg-purple-100 text-purple-700",
	delivered: "bg-green-100 text-green-700",
	cancelled: "bg-red-100 text-red-700",
};

export function OrderOne({ order, onDownloadInvoice }: OrderOneProps) {
	const { formatPrice } = usePriceFormatter() as any;

	const formatDate = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleDateString("en-US", {
				weekday: "short",
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		} catch {
			return dateString;
		}
	};

	return (
		<div className="w-full max-w-4xl mx-auto p-6 bg-white/80 border border-metal-gold/20 rounded-2xl shadow-subtle">
			{/* Order Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-metal-gold/20">
				<div>
					<h2 className="text-2xl font-bold text-deep-black">
						Order: {order.orderNumber}
					</h2>
					<p className="text-sm text-deep-black/70 mt-1">
						Order ID: {order.id}
					</p>
				</div>
				<Button
					variant="outline"
					onClick={() => onDownloadInvoice?.(order.id)}
					className="border-metal-gold/20 text-deep-black hover:bg-metal-gold/10"
				>
					<Download className="w-4 h-4 mr-2" />
					Download Invoice
				</Button>
			</div>

			{/* Order Details Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div className="p-4 bg-neutral-soft rounded-lg border border-metal-gold/20">
					<p className="text-xs text-deep-black/70 uppercase tracking-wider mb-1">
						Order Status:
					</p>
					<span
						className={cn(
							"inline-flex px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide",
							STATUS_COLORS[order.status]
						)}
					>
						{order.status}
					</span>
				</div>

				<div className="p-4 bg-neutral-soft rounded-lg border border-metal-gold/20">
					<p className="text-xs text-deep-black/70 uppercase tracking-wider mb-1">
						Order Date:
					</p>
					<p className="text-sm font-medium text-deep-black">
						{formatDate(order.orderDate)}
					</p>
				</div>

				{order.deliveryDate && (
					<div className="p-4 bg-neutral-soft rounded-lg border border-metal-gold/20">
						<p className="text-xs text-deep-black/70 uppercase tracking-wider mb-1">
							Delivery Date:
						</p>
						<p className="text-sm font-medium text-deep-black">
							{formatDate(order.deliveryDate)}
						</p>
					</div>
				)}
			</div>

			{/* Order Items */}
			<div className="space-y-4 mb-6">
				<h3 className="text-lg font-semibold text-deep-black">Order Items</h3>
				{order.items.map((item) => (
					<div
						key={item.id}
						className="flex gap-4 p-4 bg-neutral-soft rounded-lg border border-metal-gold/20 transition-colors hover:bg-metal-gold/5"
					>
						{/* Product Image */}
						<div className="w-24 h-24 bg-white rounded-lg overflow-hidden border border-metal-gold/20 flex-shrink-0">
							{item.image ? (
								<Image
									src={fixUploadcareUrl(item.image)}
									alt={item.name}
									width={96}
									height={96}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-deep-black/20 text-xs">
									No image
								</div>
							)}
						</div>

						{/* Product Details */}
						<div className="flex-1 min-w-0">
							<h4 className="font-semibold text-deep-black text-lg mb-1">
								{item.name}
							</h4>
							{item.description && (
								<p className="text-sm text-deep-black/70 mb-2">
									{item.description}
								</p>
							)}
							<div className="flex items-center gap-4 text-sm">
								<span className="text-deep-black/70">
									Quantity: <span className="font-medium text-deep-black">{item.quantity}</span>
								</span>
								<span className="text-metal-gold font-bold text-lg">
									{formatPrice(item.price)}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Order Summary */}
			<div className="border-t border-metal-gold/20 pt-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div className="p-4 bg-neutral-soft rounded-lg border border-metal-gold/20">
						<p className="text-sm text-deep-black/70 mb-1">Paid via</p>
						<p className="font-semibold text-deep-black">{order.paymentMethod}</p>
					</div>

					<div className="p-4 bg-metal-gold/10 rounded-lg border-2 border-metal-gold">
						<p className="text-sm text-deep-black/70 mb-1">Total:</p>
						<p className="text-3xl font-bold text-deep-black">
							{formatPrice(order.total)}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
