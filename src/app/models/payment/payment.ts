import { Amount } from './amount';
import { Confirmation } from './confirmation';

export class Payment {
    id: string;
    status: string;
    paid: boolean;
    amount: Amount;
    confirmation: Confirmation;
    capture: boolean;
    description: string;
  }