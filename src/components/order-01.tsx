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
	pending: "bg-amber-mirage-warm/20 text-amber-mirage-700",
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
		<div className="w-full max-w-4xl mx-auto p-6 bg-amber-mirage-soft border border-amber-mirage-200 rounded-2xl shadow-amber">
			{/* Order Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-amber-mirage-200">
				<div>
					<h2 className="text-2xl font-bold text-amber-mirage-brown">
						Order: {order.orderNumber}
					</h2>
					<p className="text-sm text-amber-mirage-600 mt-1">
						Order ID: {order.id}
					</p>
				</div>
				<Button
					variant="outline"
					onClick={() => onDownloadInvoice?.(order.id)}
					className="border-amber-mirage-300 text-amber-mirage-brown hover:bg-amber-mirage-warm/10"
				>
					<Download className="w-4 h-4 mr-2" />
					Download Invoice
				</Button>
			</div>

			{/* Order Details Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				<div className="p-4 bg-amber-mirage-100 rounded-lg border border-amber-mirage-200">
					<p className="text-xs text-amber-mirage-600 uppercase tracking-wider mb-1">
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

				<div className="p-4 bg-amber-mirage-100 rounded-lg border border-amber-mirage-200">
					<p className="text-xs text-amber-mirage-600 uppercase tracking-wider mb-1">
						Order Date:
					</p>
					<p className="text-sm font-medium text-amber-mirage-brown">
						{formatDate(order.orderDate)}
					</p>
				</div>

				{order.deliveryDate && (
					<div className="p-4 bg-amber-mirage-100 rounded-lg border border-amber-mirage-200">
						<p className="text-xs text-amber-mirage-600 uppercase tracking-wider mb-1">
							Delivery Date:
						</p>
						<p className="text-sm font-medium text-amber-mirage-brown">
							{formatDate(order.deliveryDate)}
						</p>
					</div>
				)}
			</div>

			{/* Order Items */}
			<div className="space-y-4 mb-6">
				<h3 className="text-lg font-semibold text-amber-mirage-brown">Order Items</h3>
				{order.items.map((item) => (
					<div
						key={item.id}
						className="flex gap-4 p-4 bg-amber-mirage-100 rounded-lg border border-amber-mirage-200 transition-colors hover:bg-amber-mirage-200/50"
					>
						{/* Product Image */}
						<div className="w-24 h-24 bg-amber-mirage-soft rounded-lg overflow-hidden border border-amber-mirage-300 flex-shrink-0">
							{item.image ? (
								<Image
									src={fixUploadcareUrl(item.image)}
									alt={item.name}
									width={96}
									height={96}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-amber-mirage-400 text-xs">
									No image
								</div>
							)}
						</div>

						{/* Product Details */}
						<div className="flex-1 min-w-0">
							<h4 className="font-semibold text-amber-mirage-brown text-lg mb-1">
								{item.name}
							</h4>
							{item.description && (
								<p className="text-sm text-amber-mirage-700 mb-2">
									{item.description}
								</p>
							)}
							<div className="flex items-center gap-4 text-sm">
								<span className="text-amber-mirage-600">
									Quantity: <span className="font-medium text-amber-mirage-brown">{item.quantity}</span>
								</span>
								<span className="text-amber-mirage-gold font-bold text-lg">
									{formatPrice(item.price)}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Order Summary */}
			<div className="border-t border-amber-mirage-200 pt-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div className="p-4 bg-amber-mirage-100 rounded-lg border border-amber-mirage-200">
						<p className="text-sm text-amber-mirage-600 mb-1">Paid via</p>
						<p className="font-semibold text-amber-mirage-brown">{order.paymentMethod}</p>
					</div>

					<div className="p-4 bg-amber-mirage-gold/10 rounded-lg border-2 border-amber-mirage-gold">
						<p className="text-sm text-amber-mirage-700 mb-1">Total:</p>
						<p className="text-3xl font-bold text-amber-mirage-brown">
							{formatPrice(order.total)}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
