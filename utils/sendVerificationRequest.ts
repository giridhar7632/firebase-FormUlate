import { SendVerificationRequestParams } from "next-auth/providers";
import { createTransport } from "nodemailer";

export async function sendVerificationRequest(
  params: SendVerificationRequestParams,
) {
  const { identifier, url, provider, theme } = params;
  const { host } = new URL(url);
  // NOTE: You are not required to use `nodemailer`, use whatever you want.
  const transport = createTransport(provider.server);
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to FormUlate`,
    text: text({ url, host }),
    html: html({ url, host, theme }),
  });
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */

function html(params: { url: string; host: string; theme: any }) {
  const { url } = params;

  return `
<body
	style="
		padding: 50px 20px;
		background: #f9f9f9;
		font-family: Prompt, Arial, sans-serif;
	"
>
	<style>
		@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;700&display=swap');
	</style>
	<table
		width="100%"
		border="0"
		cellspacing="20"
		cellpadding="0"
		style="
			max-width: 600px;
			margin: auto;
			border-radius: 16px;
			background-color: white;
			border: 2px solid #f3f4f6;
			padding: 30px;
		"
	>
		<tr>
			<td align="center" style="padding: 10px 0px; font-size: 22px">
				Sign in to <strong>FormUlate</strong>
			</td>
		</tr>
		<tr>
			<td align="center" style="padding: 10px 0">
				<table border="0" cellspacing="0" cellpadding="0">
					<tr>
						<td align="center" style="border-radius: 12px" bgcolor="#3b82f6">
							<a
								href="${url}"
								target="_blank"
								style="
									font-size: 18px;
									color: white;
									text-decoration: none;
									border-radius: 12px;
									padding: 10px 20px;
									border: 1px solid #3b82f6;
									display: inline-block;
									font-weight: bold;
								"
								>Sign in</a
							>
						</td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td
				align="center"
				style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px"
			>
				If you are not expecting this email you can safely ignore it.
			</td>
		</tr>
	</table>
</body>
`;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}
