export class User {
  name: string;
  email: string;
  login: string;
  type: string;
  companyCode: string;
  password: string;

  constructor(
    name: string,
    email: string,
    type: string,
    companyCode: string,
    password: string
  ) {
    this.name = name;
    this.email = email;
    this.login = this.email;
    this.type = type;
    this.companyCode = companyCode;
    this.password = password;
  }
}

export interface Login {
  login: string;
  password: string;
}

export interface Transfer {
  tndAmount: number;
  ctAmount: number;
}

export interface Transaction {
  id: number;
  name: string;
  icon: string;
  sender: string;
  receiver: string;
  subtext: string;
  create_date: string;
  category: string;
  status: string;
  amount: number;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  type: string;
  balance: number;
  companyCode: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export interface Course {
  id: number;
  name: string;
  author: string;
  category: string;
  imageUrl: string;
  is_purchased: boolean;
  image: string;
  price_lc: number;
  description: string;
}

export interface Account {
  id: number;
  name: string;
  email: string;
  type: string;
  status: 'Active' | 'Inactive';
  balance: number;
  createdAt: string;
  loading?: boolean; // ✅ facultatif
}
