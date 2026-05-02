"use client";

import { Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ProfilAddressSection } from "@/components/shared/customer/profil/profil-address-section";
import { ProfilForm } from "@/components/shared/customer/profil/profil-form";
import { ProfilInfoCard } from "@/components/shared/customer/profil/profil-info-card";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { updateAvatar, updateProfile } from "@/lib/actions/profile";

interface Profile {
	id: string;
	full_name: string;
	phone: string | null;
	email: string | null;
	loyalty_tier: string;
	loyalty_points: number;
	addresses: {
		id?: string;
		label?: string;
		full_address?: string;
		detail?: string;
		is_primary?: boolean;
	}[];
	avatar_url?: string | null;
}

interface ProfilClientProps {
	profile: Profile;
}

export function ProfilClient({ profile }: ProfilClientProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showAddAddress, setShowAddAddress] = useState(false);
	const [newAddr, setNewAddr] = useState({ label: "", detail: "" });
	const [deleteAddressIndex, setDeleteAddressIndex] = useState<number | null>(null);
	const router = useRouter();

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		const formData = new FormData(event.currentTarget);
		formData.append("addresses", JSON.stringify(profile.addresses));
		try {
			const result = await updateProfile(formData);
			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Profil berhasil diperbarui!");
				setIsEditing(false);
				router.refresh();
			}
		} catch (_err) {
			toast.error("Terjadi kesalahan saat menyimpan profil.");
		} finally {
			setLoading(false);
		}
	}

	async function handleAddAddress() {
		if (!newAddr.label || !newAddr.detail) {
			toast.error("Label dan detail alamat harus diisi");
			return;
		}
		setLoading(true);
		const updatedAddresses = [...profile.addresses, newAddr];
		const formData = new FormData();
		formData.append("full_name", profile.full_name);
		formData.append("phone", profile.phone || "");
		formData.append("addresses", JSON.stringify(updatedAddresses));
		try {
			const result = await updateProfile(formData);
			if (result.error) toast.error(result.error);
			else {
				toast.success("Alamat berhasil ditambahkan");
				setShowAddAddress(false);
				setNewAddr({ label: "", detail: "" });
				router.refresh();
			}
		} catch (_err) {
			toast.error("Gagal menambah alamat");
		} finally {
			setLoading(false);
		}
	}

	async function handleDeleteAddress() {
		if (deleteAddressIndex === null) return;
		setLoading(true);
		const updatedAddresses = profile.addresses.filter((_, i) => i !== deleteAddressIndex);
		const formData = new FormData();
		formData.append("full_name", profile.full_name);
		formData.append("phone", profile.phone || "");
		formData.append("addresses", JSON.stringify(updatedAddresses));
		try {
			const result = await updateProfile(formData);
			if (result.error) toast.error(result.error);
			else {
				toast.success("Alamat berhasil dihapus");
				router.refresh();
			}
		} finally {
			setLoading(false);
			setDeleteAddressIndex(null);
		}
	}

	async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;
		setLoading(true);
		const formData = new FormData();
		formData.append("avatar", file);
		try {
			const result = await updateAvatar(formData);
			if (result.error) {
				toast.error(result.error);
			} else {
				toast.success("Foto profil diperbarui!");
				router.refresh();
			}
		} catch (_err) {
			toast.error("Gagal mengunggah foto profil.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-0 space-y-8 pb-20">
			<AlertDialog
				open={deleteAddressIndex !== null}
				onOpenChange={(open: boolean) => !open && setDeleteAddressIndex(null)}
			>
				<AlertDialogContent className="rounded-[2.5rem] border-slate-100 p-8">
					<AlertDialogHeader>
						<div className="w-16 h-16 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center text-3xl mb-4 mx-auto sm:mx-0 shadow-inner">
							<Trash2 />
						</div>
						<AlertDialogTitle className="text-2xl font-black font-[family-name:var(--font-heading)] text-slate-900">
							Hapus Alamat?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-slate-500 font-medium text-base">
							Alamat ini akan dihapus dari profil Anda. Tindakan ini tidak dapat dibatalkan.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
						<AlertDialogCancel className="rounded-2xl h-14 font-black uppercase tracking-widest text-xs border-slate-100 hover:bg-slate-50 transition-all">
							Batal
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e: React.MouseEvent) => {
								e.preventDefault();
								handleDeleteAddress();
							}}
							disabled={loading}
							className="rounded-2xl h-14 font-black uppercase tracking-widest text-xs bg-red-500 hover:bg-red-600 shadow-xl shadow-red-100 transition-all"
						>
							{loading ? "Menghapus..." : "Ya, Hapus Alamat"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
				<h1 className="text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tight">
					Profil <span className="text-brand-gradient">Saya</span>
				</h1>
				<p className="text-slate-500 mt-2 font-medium">
					Kelola informasi pribadi dan alamat pengiriman Anda.
				</p>
			</motion.div>

			<div className="grid md:grid-cols-3 gap-8">
				<ProfilInfoCard profile={profile} loading={loading} onAvatarChange={handleAvatarChange} />

				{/* Right Col - Forms */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="md:col-span-2 space-y-8"
				>
					<ProfilForm
						profile={profile}
						isEditing={isEditing}
						loading={loading}
						onToggleEdit={() => setIsEditing(!isEditing)}
						onSubmit={handleSubmit}
					/>
					<ProfilAddressSection
						addresses={profile.addresses}
						loading={loading}
						showAddAddress={showAddAddress}
						newAddr={newAddr}
						onShowAddAddress={() => setShowAddAddress(true)}
						onHideAddAddress={() => setShowAddAddress(false)}
						onNewAddrChange={setNewAddr}
						onAddAddress={handleAddAddress}
						onDeleteAddress={(index: number) => setDeleteAddressIndex(index)}
					/>
				</motion.div>
			</div>
		</div>
	);
}
