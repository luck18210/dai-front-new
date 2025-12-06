import TronWeb from 'tronweb';
import { NETWORK, TRON_API, USDT_contract } from '../config';

export const tronWeb = new TronWeb({
    fullHost: NETWORK,
    headers: TRON_API
});