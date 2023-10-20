
/**
 * 获取script命令中的参数，参数形式 --key=value
 * @param {String} key 键名
 * @returns 键名对应的参数值value
 */
function getArgFromPackageScripts(key) {
    var args = process.argv.filter(item => {
            return /^--/.test(item);
        }),
        argObj = {};

    if (!args.length) {
        return;
    }

    args.forEach(item => {
        var str = item.slice(2),
            kvArr = str.split('='),
            key = kvArr[0],
            value = kvArr[1];
        
        argObj[key] = value;
    });

    return argObj[key];
}

module.exports = {
    getArgFromPackageScripts,
};