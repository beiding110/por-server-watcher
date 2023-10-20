function timePattern(date, fmt) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
        "H+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    var week = {
        "0": "日",
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[date.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

function calcIntersection(arr1, arr2, fun) {
    var intersection = [],
        fun = fun || function(item1, item2) {return item1 === item2;};

    arr1.forEach(item1 => {
        if (arr2.some(item2 => {
            return fun(item1, item2)
        })) {
            intersection.push(item1);
        }
    });

    var sa1 = arr1.filter(item => {
        return !intersection.some(i => {
            return fun(item, i);
        })
    });

    var sa2 = arr2.filter(item => {
        return !intersection.some(i => {
            return fun(item, i);
        })
    });

    return {
        left: sa1,
        inc: intersection,
        right: sa2,
    }
}

module.exports = {
    getTime() {
        return timePattern(new Date(), 'yyyy-MM-dd HH:mm:ss');
    },
    calcIntersection,
}