//frontend/src/app/components/wallet/wallet.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet.html',
  styleUrls: ['./wallet.css']
})
export class WalletComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  rechargeAmount: number = 0;
  loading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  transactionHistory: any[] = []; // Podrías expandir esto con un servicio de transacciones

  ngOnInit(): void {
    this.loadTransactionHistory();
  }

  loadTransactionHistory(): void {
    // Por ahora simulamos historial, podrías conectar con un servicio real
    this.transactionHistory = [
      { type: 'recharge', amount: 50, date: new Date('2024-01-15'), description: 'Recarga inicial' },
      { type: 'reservation', amount: -29.99, date: new Date('2024-01-16'), description: 'Reserva - Cyberpunk 2077' },
      { type: 'refund', amount: 29.99, date: new Date('2024-01-17'), description: 'Reembolso - Cyberpunk 2077' },
      { type: 'recharge', amount: 100, date: new Date('2024-01-18'), description: 'Recarga mensual' }
    ];
  }

  rechargeWallet(): void {
    if (this.rechargeAmount <= 0) {
      this.showMessage('El monto debe ser mayor a 0', 'error');
      return;
    }

    if (this.rechargeAmount > 1000) {
      this.showMessage('El monto máximo por recarga es $1000', 'error');
      return;
    }

    const currentUser = this.authService.user();
    if (!currentUser) {
      this.showMessage('Debes iniciar sesión para recargar tu wallet', 'error');
      return;
    }

    this.loading = true;
    this.userService.recargarWallet({
      userId: currentUser.id,
      amount: this.rechargeAmount
    }).subscribe({
      next: (response: any) => {
        // Actualizar el usuario local con el nuevo saldo
        this.authService.user.set({
          ...currentUser,
          wallet: response.newBalance
        });

        this.showMessage(response.message || 'Wallet recargado exitosamente', 'success');
        this.rechargeAmount = 0;
        this.loading = false;
        
        // Agregar a historial
        this.transactionHistory.unshift({
          type: 'recharge',
          amount: this.rechargeAmount,
          date: new Date(),
          description: 'Recarga de saldo'
        });
      },
      error: (error) => {
        this.showMessage(
          error.error?.message || 'Error al recargar el wallet', 
          'error'
        );
        this.loading = false;
      }
    });
  }

  quickRecharge(amount: number): void {
    this.rechargeAmount = amount;
    this.rechargeWallet();
  }

  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    
    // Auto-ocultar mensaje después de 5 segundos
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  get userBalance(): number {
    return this.authService.user()?.wallet || 0;
  }

  get currentUser(): any {
    return this.authService.user();
  }

  getTransactionClass(transaction: any): string {
    return transaction.amount > 0 ? 'transaction-positive' : 'transaction-negative';
  }

  getTransactionIcon(transaction: any): string {
    switch (transaction.type) {
      case 'recharge': return '💰';
      case 'reservation': return '🎮';
      case 'refund': return '↩️';
      default: return '💳';
    }
  }
}
