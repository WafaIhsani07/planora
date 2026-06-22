export const Colors = {
  Reset: '\x1b[0m',
  Green: '\x1b[32m',
  Yellow: '\x1b[33m',
  Red: '\x1b[31m',
  Magenta: '\x1b[35m',
  Gray: '\x1b[90m',
};

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private getTimestamp(): string {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    });
    return `${dateStr}, ${timeStr}`;
  }

  private printMessage(level: string, message: any, color: string) {
    const pid = process.pid;
    const timestamp = this.getTimestamp();

    const appPart = `${Colors.Green}[App]${Colors.Reset}`;
    const pidPart = `${pid}`;
    const timePart = `${Colors.Gray}${timestamp}${Colors.Reset}`;
    const levelPart = `${color}${level}${Colors.Reset}`;
    const contextPart = `${color}[${this.context}]${Colors.Reset}`;
    const messagePart = `${color}${message}${Colors.Reset}`;

    // Format: [App] PID  - MM/DD/YYYY, h:mm:ss A   LOG [NamaKonteks] Pesan log di sini...
    console.log(`${appPart} ${pidPart}  - ${timePart}   ${levelPart} ${contextPart} ${messagePart}`);
  }

  log(message: any) {
    this.printMessage('LOG', message, Colors.Green);
  }

  warn(message: any) {
    this.printMessage('WARN', message, Colors.Yellow);
  }

  error(message: any) {
    this.printMessage('ERROR', message, Colors.Red);
  }

  debug(message: any) {
    this.printMessage('DEBUG', message, Colors.Magenta);
  }
}
