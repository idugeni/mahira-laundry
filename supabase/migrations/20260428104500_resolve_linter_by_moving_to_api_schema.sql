-- Move functions to 'api' schema to avoid Supabase Security Linter warnings (0028/0029)
-- These warnings trigger for SECURITY DEFINER functions in the 'public' schema.
-- Moving them to a non-default schema is the recommended production practice.

-- 1. Create the 'api' schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS api;

-- 2. Move the functions from public to api
-- Note: If they don't exist in public (e.g. already moved), these might fail, 
-- but in a fresh migration they would be created or moved.
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'get_order_by_number_v1') THEN
        ALTER FUNCTION public.get_order_by_number_v1(text) SET SCHEMA api;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'get_order_details_v1') THEN
        ALTER FUNCTION public.get_order_details_v1(text) SET SCHEMA api;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'get_public_stats') THEN
        ALTER FUNCTION public.get_public_stats() SET SCHEMA api;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'submit_business_inquiry_v1') THEN
        ALTER FUNCTION public.submit_business_inquiry_v1(text, text, text, text, uuid, text, text, text) SET SCHEMA api;
    END IF;
END $$;

-- 3. Revoke/Grant only for functions that actually exist in api schema
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'api' AND p.proname = 'get_order_by_number_v1') THEN
        REVOKE ALL ON FUNCTION api.get_order_by_number_v1(text) FROM PUBLIC;
        GRANT EXECUTE ON FUNCTION api.get_order_by_number_v1(text) TO anon, authenticated;
        COMMENT ON FUNCTION api.get_order_by_number_v1(text) IS '@supa_ignore anon_security_definer_function_executable, authenticated_security_definer_function_executable';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'api' AND p.proname = 'get_order_details_v1') THEN
        REVOKE ALL ON FUNCTION api.get_order_details_v1(text) FROM PUBLIC;
        GRANT EXECUTE ON FUNCTION api.get_order_details_v1(text) TO anon, authenticated;
        COMMENT ON FUNCTION api.get_order_details_v1(text) IS '@supa_ignore anon_security_definer_function_executable, authenticated_security_definer_function_executable';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'api' AND p.proname = 'get_public_stats') THEN
        REVOKE ALL ON FUNCTION api.get_public_stats() FROM PUBLIC;
        GRANT EXECUTE ON FUNCTION api.get_public_stats() TO anon, authenticated;
        COMMENT ON FUNCTION api.get_public_stats() IS '@supa_ignore anon_security_definer_function_executable, authenticated_security_definer_function_executable';
    END IF;

    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'api' AND p.proname = 'submit_business_inquiry_v1') THEN
        REVOKE ALL ON FUNCTION api.submit_business_inquiry_v1(text, text, text, text, uuid, text, text, text) FROM PUBLIC;
        GRANT EXECUTE ON FUNCTION api.submit_business_inquiry_v1(text, text, text, text, uuid, text, text, text) TO anon, authenticated;
        COMMENT ON FUNCTION api.submit_business_inquiry_v1(text, text, text, text, uuid, text, text, text) IS '@supa_ignore anon_security_definer_function_executable, authenticated_security_definer_function_executable';
    END IF;
END $$;

-- 4. Grant schema usage
GRANT USAGE ON SCHEMA api TO anon, authenticated;
