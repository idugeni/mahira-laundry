-- Grant EXECUTE permission on internal helper functions to anon role
-- This is required because these functions are used in RLS policies that apply to the public role
-- When an anonymous user accesses these tables, the RLS policy evaluation fails without these permissions,
-- resulting in 401 Unauthorized errors from PostgREST.

GRANT EXECUTE ON FUNCTION internal.get_user_role() TO anon;
GRANT EXECUTE ON FUNCTION internal.is_manager_or_above() TO anon;
GRANT EXECUTE ON FUNCTION internal.is_staff_or_above() TO anon;
GRANT EXECUTE ON FUNCTION internal.get_user_outlet() TO anon;

-- Ensure authenticated role also has explicit execute permissions
GRANT EXECUTE ON FUNCTION internal.get_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION internal.is_manager_or_above() TO authenticated;
GRANT EXECUTE ON FUNCTION internal.is_staff_or_above() TO authenticated;
GRANT EXECUTE ON FUNCTION internal.get_user_outlet() TO authenticated;
