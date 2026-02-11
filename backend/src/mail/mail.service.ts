import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private transporter: nodemailer.Transporter;

    constructor() {
        // Crear transporter con las variables de entorno
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.gmail.com',
            port: Number(process.env.MAIL_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    async sendOtpToken(email: string, token: string, nombres: string): Promise<void> {
        // Siempre logueamos en consola (útil para debug)
        this.logger.log('══════════════════════════════════════════');
        this.logger.log(`📧 EMAIL ENVIADO A: ${email}`);
        this.logger.log(`👤 Cliente: ${nombres}`);
        this.logger.log(`🔑 Token OTP: ${token}`);
        this.logger.log('══════════════════════════════════════════');

        // Si hay credenciales SMTP configuradas, enviar email real
        if (process.env.MAIL_USER && process.env.MAIL_PASS) {
            try {
                await this.transporter.sendMail({
                    from: process.env.MAIL_FROM || `"ePayco Wallet" <${process.env.MAIL_USER}>`,
                    to: email,
                    subject: '🔐 ePayco Wallet - Token de confirmación de pago',
                    html: `
                        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
                            <div style="background: linear-gradient(135deg, #10b981, #06b6d4); padding: 32px; text-align: center;">
                                <h1 style="color: white; margin: 0; font-size: 24px;">ePayco Wallet</h1>
                                <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Confirmación de pago</p>
                            </div>
                            <div style="padding: 32px;">
                                <p style="color: #cbd5e1; font-size: 15px; margin: 0 0 24px;">
                                    Hola <strong style="color: #f1f5f9;">${nombres}</strong>,
                                </p>
                                <p style="color: #94a3b8; font-size: 14px; margin: 0 0 16px;">
                                    Tu token de confirmación de pago es:
                                </p>
                                <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
                                    <span style="font-size: 36px; letter-spacing: 12px; font-weight: bold; color: #10b981; font-family: 'Courier New', monospace;">
                                        ${token}
                                    </span>
                                </div>
                                <p style="color: #64748b; font-size: 13px; margin: 0; text-align: center;">
                                    ⏱ Este token expira en <strong style="color: #f59e0b;">10 minutos</strong>
                                </p>
                            </div>
                            <div style="background: #1e293b; padding: 16px 32px; text-align: center; border-top: 1px solid #334155;">
                                <p style="color: #475569; font-size: 12px; margin: 0;">
                                    Si no solicitaste este pago, ignora este mensaje.
                                </p>
                            </div>
                        </div>
                    `,
                });

                this.logger.log('✅ Email enviado exitosamente');
            } catch (error) {
                this.logger.error(`❌ Error al enviar email: ${error.message}`);
                // No lanzar error — el token ya se mostró en consola como fallback
            }
        } else {
            this.logger.warn('⚠️  MAIL_USER / MAIL_PASS no configurados — Token solo en consola');
        }
    }

    async sendResetPasswordToken(email: string, token: string, nombres: string): Promise<void> {
        this.logger.log('══════════════════════════════════════════');
        this.logger.log(`📧 RESET PASSWORD para: ${email}`);
        this.logger.log(`🔑 Token: ${token}`);
        this.logger.log('══════════════════════════════════════════');

        if (process.env.MAIL_USER && process.env.MAIL_PASS) {
            try {
                await this.transporter.sendMail({
                    from: process.env.MAIL_FROM || `"ePayco Wallet" <${process.env.MAIL_USER}>`,
                    to: email,
                    subject: '🔑 ePayco Wallet - Restablecer contraseña',
                    html: `
                        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
                            <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 32px; text-align: center;">
                                <h1 style="color: white; margin: 0; font-size: 24px;">ePayco Wallet</h1>
                                <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Restablecer contraseña</p>
                            </div>
                            <div style="padding: 32px;">
                                <p style="color: #cbd5e1; font-size: 15px; margin: 0 0 24px;">
                                    Hola <strong style="color: #f1f5f9;">${nombres}</strong>,
                                </p>
                                <p style="color: #94a3b8; font-size: 14px; margin: 0 0 16px;">
                                    Recibimos una solicitud para restablecer tu contraseña. Usa el siguiente token:
                                </p>
                                <div style="background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 16px; text-align: center; margin: 0 0 24px; word-break: break-all;">
                                    <span style="font-size: 12px; color: #f59e0b; font-family: 'Courier New', monospace;">
                                        ${token}
                                    </span>
                                </div>
                                <p style="color: #64748b; font-size: 13px; margin: 0; text-align: center;">
                                    ⏱ Este token expira en <strong style="color: #f59e0b;">30 minutos</strong>
                                </p>
                            </div>
                            <div style="background: #1e293b; padding: 16px 32px; text-align: center; border-top: 1px solid #334155;">
                                <p style="color: #475569; font-size: 12px; margin: 0;">
                                    Si no solicitaste restablecer tu contraseña, ignora este mensaje.
                                </p>
                            </div>
                        </div>
                    `,
                });

                this.logger.log('✅ Email de reset enviado exitosamente');
            } catch (error) {
                this.logger.error(`❌ Error al enviar email: ${error.message}`);
            }
        }
    }
}
