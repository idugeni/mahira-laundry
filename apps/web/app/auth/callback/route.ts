import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDashboardUrl } from "@/lib/utils";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type");

  let targetUrl = "/customer";
  const supabase = await createClient();

  if (code) {
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    if (data?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();
        
      targetUrl = getDashboardUrl(profile?.role);
    }
  }

  if (type === "recovery") {
    return NextResponse.redirect(new URL("/profil", requestUrl.origin));
  }

  return NextResponse.redirect(new URL(targetUrl, requestUrl.origin));
}
