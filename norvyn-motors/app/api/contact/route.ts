import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const TO_EMAIL = 'nicobaeuerle1@gmail.com'
const FROM_EMAIL = 'Norvyn Motors <onboarding@resend.dev>'

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY ?? 'missing')
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
    }

    const subjectLine = subject
      ? `Norvyn Motors Anfrage: ${subject} — ${name}`
      : `Norvyn Motors Anfrage von ${name}`

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: email,
      subject: subjectLine,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C9A96E; border-bottom: 1px solid #333; padding-bottom: 12px;">
            Neue Anfrage über norvyn-motors.de
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #888; width: 140px;">Name</td>
              <td style="padding: 8px 0; color: #fff;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #888;">E-Mail</td>
              <td style="padding: 8px 0; color: #fff;">${email}</td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 8px 0; color: #888;">Telefon</td>
              <td style="padding: 8px 0; color: #fff;">${phone}</td>
            </tr>` : ''}
            ${subject ? `
            <tr>
              <td style="padding: 8px 0; color: #888;">Betreff</td>
              <td style="padding: 8px 0; color: #fff;">${subject}</td>
            </tr>` : ''}
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #111; border-left: 3px solid #C9A96E;">
            <p style="color: #888; font-size: 12px; margin: 0 0 8px;">Nachricht</p>
            <p style="color: #fff; white-space: pre-wrap; margin: 0;">${message}</p>
          </div>
          <p style="margin-top: 24px; color: #555; font-size: 12px;">
            Auf diese E-Mail antworten um direkt mit ${name} zu kommunizieren.
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'E-Mail konnte nicht gesendet werden' }, { status: 500 })
  }
}
