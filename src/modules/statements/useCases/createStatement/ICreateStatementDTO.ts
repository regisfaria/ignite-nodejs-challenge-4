// import { Statement } from '../../entities/Statement';

// export type ICreateStatementDTO = Pick<
//   Statement,
//   'user_id' | 'description' | 'amount' | 'type'
// >;

export type ICreateStatementDTO = {
  user_id: string;
  description: string;
  amount: number;
  type: OperationType;
};
