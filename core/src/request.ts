import { Call } from './call';

export interface Request {
  responseId: unknown;
  call: Call;
}
