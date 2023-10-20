import axios from 'axios';
import qs from 'qs';
import { MessageBox } from 'element-ui';

import { getToken } from '@/js/token.js';

const REQUEST_URL =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'http://yourserver/watcher';

function argsCheck(a, b, c, d) {
    var obj = {
        url: a,
        data: {},
        success: function () {},
        fztype: false,
    };

    var args = [];
    args.push.apply(args, arguments);
    args = args.filter((item) => item);

    if (args.length == 2 && typeof b == 'function') {
        obj.success = b;
    } else if (args.length == 2 && typeof b != 'function') {
        obj.data = b;
    } else if (args.length == 3) {
        if (typeof args[args.length - 1] == 'boolean') {
            obj.data = b;
            obj.fztype = c;
        } else {
            obj.data = b;
            obj.success = c;
        }
    } else if (args.length == 4) {
        obj.data = b;
        obj.success = c;
        obj.fztype = d;
    }

    return obj;
}

axios.interceptors.response.use(({ data, config, headers }) => {
    const consoleString = JSON.stringify({
        request: config,
        response: data,
    });

    var switchObj = {
        v: () => data.tdata,
        pglist: () => data,
        valerror: () => {
            config.error && config.error();

            MessageBox.alert(data.msg, {
                type: 'error',
            });

            return false;
        },
        'login-index': () => {
            config.error && config.error();

            // 如果客户端
            if (window.electronApi) {
                //data为用户信息
                window.electronApi.dispatch('logout', data);
            }

            return false;
        },
        redirect: () => {
            config.error && config.error();

            window.location.assign(data.url);

            return false;
        },
        error: () => {
            config.error && config.error();

            MessageBox.alert(data.msg, {
                type: 'error',
            });

            return false;
        },
    };

    var fun = switchObj[data.code],
        res = false;

    if (fun) {
        res = fun();
    } else {
        console.error(data);
    }

    if (data.code === 'v') {
        return [res, data];
    } else if (res !== false) {
        return [res, data];
    } else {
        return false;
    }
});

export function $get(a, b, c, d) {
    var settings = argsCheck(a, b, c, d);

    $ajax(settings);
}

export function $post(a, b, c, d) {
    var settings = argsCheck(a, b, c, d);

    $ajax({
        type: 'post',
        ...settings,
    });
}

export function $ajax({ type, url, data, success, error, complete, fztype }) {
    // if (window.electronApi) {
    //     // 使用electron
    // } else {
    //     // web

    var token = getToken();

    var settings = {
        method: type,
        url: `${REQUEST_URL}${url}`,
        [type === 'post' ? 'data' : 'params']:
            type === 'post' && !fztype
                ? qs.stringify({
                      ...data,
                      _token: token,
                  })
                : {
                      ...data,
                      _token: token,
                  },
        headers: {
            'Content-Type': fztype
                ? 'application/json;charset=UTF-8'
                : 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        success,
        error,
    };

    axios(settings)
        .then(([data, res]) => {
            success && success(data, res);
        })
        .catch((e) => {
            error && error(data, res);
        })
        .finally(() => {
            complete && complete();
        });
    // }
}
