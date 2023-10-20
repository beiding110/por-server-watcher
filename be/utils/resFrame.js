/**
 * 返回响应体
 * 有一个参数时
 * @param {any} tdata 返回值内容
 * 多个参数时
 * @param {string} code 返回值状态
 * @param {any} tdata 返回值内容
 * @param {string} msg 返回信息
 * @return {object} { code, tdata, msg,}
 */
module.exports = function() {
    var args = [...arguments],
        response = {
            code: 'v',
            tdata: undefined,
            msg: '',
        };

    if(args.length === 1) {
        response.tdata = args[0];
    } else {
        response.code = args[0];
        response.tdata = args[1];
        response.msg = args[2] || '';
    }

    return response;
}