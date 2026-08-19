export interface UserProps {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export class User {
  constructor(private readonly props: UserProps) {
    if (!props.email.includes('@')) {
      throw new Error('Invalid email address');
    }
  }

  get id(): string { return this.props.id; }
  get username(): string { return this.props.username; }
  get email(): string { return this.props.email; }
  get avatar(): string | undefined { return this.props.avatar; }
}
