import type { Mail } from './mailer'

// E-mail de confirmation de signature de la déclaration PauseAI.

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

export function confirmationEmail(opts: {
	to: string
	firstName: string
	link: string
	lang: 'fr' | 'en'
}): Mail {
	const { to, firstName, link, lang } = opts
	const en = lang === 'en'
	const subject = en
		? 'Confirm your signature of the PauseAI statement'
		: 'Confirmez votre signature de la déclaration PauseAI'
	const hello = en ? `Hello ${firstName},` : `Bonjour ${firstName},`
	const intro = en
		? 'Thank you for signing the PauseAI statement. One last step: please confirm your email address so that your signature is counted.'
		: 'Merci d’avoir signé la déclaration PauseAI. Dernière étape : confirmez votre adresse e-mail pour que votre signature soit comptabilisée.'
	const button = en ? 'Confirm my signature' : 'Confirmer ma signature'
	const statement = en
		? '“We call on the governments of the world to sign an international treaty implementing a pause on the training of the most powerful general AI systems, until we know how to build them safely and keep them under democratic control.”'
		: '« Nous appelons les gouvernements du monde entier à signer un traité international instaurant une pause dans l’entraînement des systèmes d’IA généralistes les plus puissants, jusqu’à ce que nous sachions les construire de manière sûre et les maintenir sous contrôle démocratique. »'
	const ignore = en
		? 'If you did not sign this statement, simply ignore this email: nothing will be recorded in your name.'
		: 'Si vous n’avez pas signé cette déclaration, ignorez simplement cet e-mail : rien ne sera enregistré à votre nom.'
	const validity = en ? 'This link is valid for 30 days.' : 'Ce lien est valable 30 jours.'
	const sign = en ? 'The Pause IA team' : 'L’équipe Pause IA'

	const text = [
		hello,
		'',
		intro,
		'',
		`${button} : ${link}`,
		'',
		statement,
		'',
		ignore,
		validity,
		'',
		sign,
		'https://pauseia.fr'
	].join('\n')

	const html = `<!doctype html>
<html lang="${lang}">
<body style="margin:0;padding:0;background:#fff5e8;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a">
	<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fff5e8;padding:24px 12px">
		<tr><td align="center">
			<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:10px;padding:32px 28px">
				<tr><td style="font-size:22px;font-weight:bold;padding-bottom:20px">Pause IA</td></tr>
				<tr><td style="font-size:16px;line-height:1.6">
					<p style="margin:0 0 14px">${esc(hello)}</p>
					<p style="margin:0 0 24px">${esc(intro)}</p>
					<p style="margin:0 0 24px;text-align:center">
						<a href="${esc(link)}" style="display:inline-block;background:#ff9416;color:#1a1a1a;text-decoration:none;font-weight:bold;padding:14px 28px;border-radius:6px">${esc(button)}</a>
					</p>
					<p style="margin:0 0 24px;padding:12px 16px;border-left:4px solid #ff9416;background:#fff5e8;font-style:italic">${esc(statement)}</p>
					<p style="margin:0 0 8px;font-size:13px;color:#676e7a">${esc(ignore)} ${esc(validity)}</p>
					<p style="margin:0 0 20px;font-size:13px;color:#676e7a;word-break:break-all">${esc(link)}</p>
					<p style="margin:0">${esc(sign)}<br><a href="https://pauseia.fr" style="color:#a85400">pauseia.fr</a></p>
				</td></tr>
			</table>
		</td></tr>
	</table>
</body>
</html>`

	return { to, subject, text, html }
}
