"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ProfilAddressSection } from "@/components/shared/customer/profil/profil-address-section";
import { ProfilForm } from "@/components/shared/customer/profil/profil-form";
import { ProfilInfoCard } from "@/components/shared/customer/profil/profil-info-card";
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

	async function handleDeleteAddress(index: number) {
		if (!confirm("Hapus alamat ini?")) return;
		setLoading(true);
		const updatedAddresses = profile.addresses.filter((_, i) => i !== index);
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
		}
	}

	async function handleAvatarChange(
		event: React.ChangeEvent<HTMLInputElement>,
	) {
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
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
			>
				<h1 className="text-3xl font-black font-[family-name:var(--font-heading)] text-slate-900 tracking-tight">
					Profil <span className="text-brand-gradient">Saya</span>
				</h1>
				<p className="text-slate-500 mt-2 font-medium">
					Kelola informasi pribadi dan alamat pengiriman Anda.
				</p>
			</motion.div>

			<div className="grid lg:grid-cols-3 gap-8">
				<ProfilInfoCard
					profile={profile}
					loading={loading}
					onAvatarChange={handleAvatarChange}
				/>

				{/* Right Col - Forms */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="lg:col-span-2 space-y-8"
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
						onDeleteAddress={handleDeleteAddress}
					/>
				</motion.div>
			</div>
		</div>
	);
}
