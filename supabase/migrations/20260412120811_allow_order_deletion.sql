-- ═══════════════════════════════════════════════════════════════
-- Allow User Order Deletion (Pending Only)
-- ═══════════════════════════════════════════════════════════════

-- 1. Tambahkan kebijakan RLS untuk Delete
-- ─────────────────────────────────────────────────────────────
-- Kebijakan: User hanya bisa menghapus order miliknya sendiri DAN statusnya masih 'pending'
CREATE POLICY "Users can delete their own pending orders" ON orders 
FOR DELETE 
USING (
  auth.uid() = customer_id 
  AND status = 'pending'
);
