// Mock service para probar notificaciones sin backend real
class MockEmailService {
  constructor() {
    this.sentEmails = [];
    this.isEnabled = true;
  }

  async sendEmailNotification(notificationData) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular error aleatorio (10% de probabilidad)
    if (Math.random() < 0.1) {
      throw new Error('Error simulado de conexión');
    }

    // Guardar email en el log
    const emailLog = {
      timestamp: new Date().toISOString(),
      to: notificationData.to,
      subject: notificationData.subject,
      html: notificationData.html,
      cc: notificationData.cc,
      status: 'sent'
    };

    this.sentEmails.push(emailLog);
    
    console.log('📧 Email enviado (MOCK):', emailLog);
    
    return {
      success: true,
      messageId: `mock-${Date.now()}`,
      emailLog
    };
  }

  getSentEmails() {
    return this.sentEmails;
  }

  clearEmails() {
    this.sentEmails = [];
  }

  enableMock() {
    this.isEnabled = true;
    console.log('🔧 Mock email service ENABLED');
  }

  disableMock() {
    this.isEnabled = false;
    console.log('🔧 Mock email service DISABLED');
  }

  // Método para mostrar los emails en consola de forma legible
  showEmailsInConsole() {
    console.log('\n📧 === EMAILS ENVIADOS (MOCK) ===');
    this.sentEmails.forEach((email, index) => {
      console.log(`\n${index + 1}. Para: ${email.to}`);
      console.log(`   Asunto: ${email.subject}`);
      console.log(`   CC: ${email.cc || 'N/A'}`);
      console.log(`   Fecha: ${new Date(email.timestamp).toLocaleString()}`);
      console.log(`   Estado: ${email.status}`);
      console.log(`   ID: ${email.messageId}`);
    });
    console.log('\n📧 === TOTAL: ' + this.sentEmails.length + ' emails ===\n');
  }
}

export default new MockEmailService();
