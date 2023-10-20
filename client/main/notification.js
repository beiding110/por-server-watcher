const { Notification } = require('electron');

const bWindow = require('./window.js');
const iconTray = require('./tray.js');

function getType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

/**
 * 调起系统通知
 * view无法通过ipc传递方法为参数，会报：An object could not be cloned
 * @param  {...any} args 
 * @returns 
 */
module.exports = function (...args) {
    var firstArg = args[0]; //首个参数

    if (getType(firstArg) === 'object') {
        /**
         * fun({
         *  title: '',
         *  content: '',
         *  onclick,
         *  onclose,
         * })
         */

        var {title = '提示', content, onclick, onclose} = firstArg;
    } else if (getType(firstArg) === 'array') {
        var firstOfFirstArg = firstArg[0];  // 首个参数为数组的首个参数，在使用ipc传参的时候会出现

        if (getType(firstOfFirstArg) === 'object') {
            var {title = '提示', content, onclick, onclose} = firstOfFirstArg;
        } else if (getType(firstOfFirstArg) === 'array') {
            var [content, title = '提示', onclick, onclose] = firstOfFirstArg;
        } else {
            /**
             * fun([ content, title, onclick, onclose ])
             */

            var [content, title = '提示', onclick, onclose] = firstArg;
        }
    } else {
        /**
         * fun( content, title, onclick, onclose )
         */
        var [content, title = '提示', onclick, onclose] = args;
    }

    var notify = new Notification({ 
        title, 
        body: content ,
        icon: './render/public/static/256.png',
    });

    if (onclick) {
        notify.on('click', () => {
            onclick();
            iconTray.shineEnd();
        });
    } else {
        notify.on('click', () => {
            bWindow.$window.show();
            iconTray.shineEnd();
        });
    }

    if (onclose) {
        notify.on('close', () => {
            onclose();
            iconTray.shineEnd();
        });
    } else {
        notify.on('close', () => {
            console.log('notify close');
            iconTray.shineEnd();
        });
    }
    
    notify.show();
    iconTray.shineStart();

    return notify;
};