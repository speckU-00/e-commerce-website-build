import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, productName, downloadUrl, orderId } = body

    if (!to || !subject || !productName) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const { data, error } = await resend.emails.send({
      from: 'AbuDigital Store <noreply@abudigital.store>',
      to: [to],
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f5;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #0a0a0a; font-size: 24px; margin: 0;">Thank You for Your Purchase!</h1>
                </div>
                
                <p style="color: #52525b; margin-bottom: 20px;">
                  Your order has been confirmed. Here are your purchase details:
                </p>
                
                <div style="background-color: #f4f4f5; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                  <p style="margin: 0 0 8px; color: #71717a; font-size: 14px;">Product</p>
                  <p style="margin: 0; color: #0a0a0a; font-weight: 600;">${productName}</p>
                </div>
                
                ${orderId ? `
                <div style="background-color: #f4f4f5; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                  <p style="margin: 0 0 8px; color: #71717a; font-size: 14px;">Order ID</p>
                  <p style="margin: 0; color: #0a0a0a; font-family: monospace;">${orderId}</p>
                </div>
                ` : ''}
                
                ${downloadUrl ? `
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${downloadUrl}" style="display: inline-block; background-color: #0a0a0a; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 500;">
                    Download Your Product
                  </a>
                </div>
                ` : ''}
                
                <p style="color: #71717a; font-size: 14px; margin-top: 30px;">
                  If you have any questions, please reply to this email or contact us at support@abudigital.store
                </p>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e4e4e7; text-align: center;">
                  <p style="color: #a1a1aa; font-size: 12px; margin: 0;">
                    &copy; ${new Date().getFullYear()} AbuDigital Store. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Email send error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
