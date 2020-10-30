import { GETRequest } from './api';
import URL from './url';

export async function getAppShareLink(data?: any): Promise<any> {
  return GETRequest({
    url: URL.getAppShareLink,
    data,
  });
}
