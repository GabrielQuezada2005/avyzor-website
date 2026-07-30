import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { newsletterConfirmSchema } from "@/lib/validations";
import { isSupabaseConfigured } from "@/lib/env";
import { env } from "@/lib/env";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const result = newsletterConfirmSchema.safeParse({ token });

  if (!result.success || !isSupabaseConfigured() || !supabaseAdmin) {
    return NextResponse.redirect(
      `${env.siteUrl}/newsletter/fehler?reason=invalid`
    );
  }

  const { data: subscriber, error: fetchError } = await supabaseAdmin
    .from("newsletter_subscribers")
    .select("id, active")
    .eq("confirmation_token", result.data.token)
    .single();

  if (fetchError || !subscriber) {
    return NextResponse.redirect(
      `${env.siteUrl}/newsletter/fehler?reason=not_found`
    );
  }

  if (subscriber.active) {
    return NextResponse.redirect(`${env.siteUrl}/newsletter/bestaetigt`);
  }

  const { error: updateError } = await supabaseAdmin
    .from("newsletter_subscribers")
    .update({
      active: true,
      confirmed_at: new Date().toISOString(),
      confirmation_token: null,
    })
    .eq("id", subscriber.id);

  if (updateError) {
    console.error("Newsletter confirm error:", updateError.message);
    return NextResponse.redirect(
      `${env.siteUrl}/newsletter/fehler?reason=server`
    );
  }

  return NextResponse.redirect(`${env.siteUrl}/newsletter/bestaetigt`);
}
