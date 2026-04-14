"use client";

interface ConfirmDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	description: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "danger" | "default";
}

export function ConfirmDialog({
	open,
	onClose,
	onConfirm,
	title,
	description,
	confirmText = "Konfirmasi",
	cancelText = "Batal",
	variant = "default",
}: ConfirmDialogProps) {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="fixed inset-0 bg-black/50" onClick={onClose} />
			<div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
				<h3 className="text-lg font-semibold font-[family-name:var(--font-heading)]">
					{title}
				</h3>
				<p className="mt-2 text-sm text-muted-foreground">{description}</p>
				<div className="mt-6 flex gap-3 justify-end">
					<button
						onClick={onClose}
						className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
					>
						{cancelText}
					</button>
					<button
						onClick={() => {
							onConfirm();
							onClose();
						}}
						className={`px-4 py-2 text-sm rounded-lg text-white transition-colors ${variant === "danger" ? "bg-red-500 hover:bg-red-600" : "bg-brand-primary hover:bg-brand-primary/90"}`}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
}
