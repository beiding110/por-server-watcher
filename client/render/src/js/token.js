import cookie from 'js-cookie';
import storage from './storage.js';

const TOKEN_NAME = 'watcher_userid',
    EXTRA_SETTING = {
        domain: '',
        path: '/',
    };

export function getToken() {
    var cToken = cookie.get(TOKEN_NAME);

    var sToken = storage.getLocal(TOKEN_NAME);

    if (cToken) {
        return cToken;
    } else {
        return sToken;
    }
}

export function setToken(token) {
    storage.setLocal(TOKEN_NAME, token);

    return cookie.set(TOKEN_NAME, token, EXTRA_SETTING);
}

export function removeToken() {
    cookie.remove(TOKEN_NAME, EXTRA_SETTING);
    storage.setLocal(TOKEN_NAME, '');

    return true;
}