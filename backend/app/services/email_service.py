"""
Email Service - Sends emails with SMTP
Handles email templates, personalization, and tracking
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, List, Optional
from datetime import datetime

class EmailService:
    """Handle email sending via SMTP"""
    
    def __init__(self):
        # Email configuration from environment variables
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.sender_email = os.getenv("SENDER_EMAIL", "noreply@extractresume.com")
        self.sender_password = os.getenv("SENDER_PASSWORD", "")
        self.app_name = "ExtractResume"
        
        # Check if we're in test/demo mode (no real SMTP credentials)
        self.is_demo = not self.sender_password or self.sender_password == "demo"
    
    def send_email(
        self, 
        recipient_email: str,
        subject: str,
        body: str,
        html_body: Optional[str] = None
    ) -> Dict:
        """
        Send an email
        
        Args:
            recipient_email: Email address of recipient
            subject: Email subject
            body: Plain text body
            html_body: HTML version of body (optional)
            
        Returns:
            Dict with status and message
        """
        
        if self.is_demo:
            # Demo mode - log instead of sending
            print(f"[DEMO EMAIL] To: {recipient_email}, Subject: {subject}")
            return {
                "status": "demo",
                "message": f"[DEMO] Email would be sent to {recipient_email}",
                "recipient": recipient_email,
                "subject": subject,
                "timestamp": datetime.now().isoformat()
            }
        
        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = self.sender_email
            message["To"] = recipient_email
            
            # Attach plain text version
            message.attach(MIMEText(body, "plain"))
            
            # Attach HTML version if provided
            if html_body:
                message.attach(MIMEText(html_body, "html"))
            
            # Connect to SMTP server and send
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(message)
            
            return {
                "status": "sent",
                "message": "Email sent successfully",
                "recipient": recipient_email,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "status": "failed",
                "message": f"Error sending email: {str(e)}",
                "recipient": recipient_email,
                "error": str(e)
            }
    
    def personalize_template(
        self,
        template_body: str,
        variables: Dict[str, str]
    ) -> str:
        """
        Replace template variables with actual values
        
        Template variables format: {variable_name}
        Example: "Dear {first_name}, I am interested in {position} at {company}"
        
        Args:
            template_body: Template text with {variable} placeholders
            variables: Dict of variable names and values
            
        Returns:
            Personalized text
        """
        
        personalized = template_body
        for key, value in variables.items():
            placeholder = f"{{{key}}}"
            personalized = personalized.replace(placeholder, str(value))
        
        return personalized
    
    def send_batch_emails(
        self,
        recipients: List[str],
        subject: str,
        template_body: str,
        template_variables_list: List[Dict]
    ) -> List[Dict]:
        """
        Send emails to multiple recipients with personalization
        
        Args:
            recipients: List of recipient email addresses
            subject: Email subject
            template_body: Template with {variables}
            template_variables_list: List of variable dicts for each recipient
            
        Returns:
            List of send results
        """
        
        results = []
        
        for i, recipient in enumerate(recipients):
            # Get variables for this recipient
            variables = template_variables_list[i] if i < len(template_variables_list) else {}
            
            # Personalize subject and body
            personalized_subject = self.personalize_template(subject, variables)
            personalized_body = self.personalize_template(template_body, variables)
            
            # Send email
            result = self.send_email(
                recipient_email=recipient,
                subject=personalized_subject,
                body=personalized_body
            )
            results.append(result)
        
        return results
    
    @staticmethod
    def generate_html_email(
        title: str,
        content: str,
        footer_text: Optional[str] = None
    ) -> str:
        """
        Generate a styled HTML email template
        
        Args:
            title: Email title/heading
            content: Email body content
            footer_text: Footer text (optional)
            
        Returns:
            HTML email string
        """
        
        footer = f"<p style='color: #666; font-size: 12px; margin-top: 40px;'>{footer_text}</p>" if footer_text else ""
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
                .header h1 {{ margin: 0; font-size: 24px; }}
                .content {{ background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }}
                .content p {{ margin: 10px 0; }}
                .cta-button {{ display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }}
                .footer {{ text-align: center; padding-top: 20px; border-top: 1px solid #ddd; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>{title}</h1>
                </div>
                <div class="content">
                    {content}
                </div>
                <div class="footer">
                    {footer}
                    <p style='color: #999; font-size: 12px;'>© 2026 ExtractResume. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return html


# Global instance
email_service = EmailService()
