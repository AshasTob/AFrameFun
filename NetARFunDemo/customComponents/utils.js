var Utils = {
    getRandomColor: function () {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;
    },
    serializeObj: function (obj) {
        var result = '';
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            result += key + ': ' + obj[key] + '; ';
        }
        return result;
    }
}