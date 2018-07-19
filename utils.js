/**
 * Метод преобразовывает аснихронную функцию fn(...cb)
 * в функцию работающую через промисы
 * @param fn
 */
exports.promisify = function (fn) {

    function createCallback(fn, resolve, reject) {

        return function (err, ...args) {
            fn.apply(null, arguments);

            if (err) {
                reject(err);
            } else {
                resolve(...args);
            }
        };

    }

    return function (...args) {

        return new Promise((resolve, reject) => {
            let hasCallback = false;

            args = args.map(ar => {

                if (typeof ar === 'function') {
                    hasCallback = true;
                    return createCallback(ar, resolve, reject);
                } else {
                    return ar;
                }

            });

            if (!hasCallback) {
                args.push(createCallback(exports.noop, resolve, reject));
            }

            fn.apply(this, args);
        });

    };

};