angular.module(<%= modulename %>)
    .service('<%= prefix %>Api', ['$q', 'jdbApi', '$ionicLoading', function ($q, jdbApi, $ionicLoading) {
        var cachePool = {};

        /**
         * @desc    发送post请求
         * @author  bukas
         * @param {string}  url                 接口地址
         * @param {object}  params              请求参数
         * @param {object}  options             配置项
         * @param {boolean} options.showLoading 是否显示loading
         * @param {boolean} options.showError   是否弹出错误信息
         */
        this.post = function (url, params, options) {
            return $q(function (resolve, reject) {
                var opts = angular.extend({
                    showLoading: true,
                    showError: true
                }, options);
                if (opts.showLoading) {
                    $ionicLoading.show();
                }
                jdbApi.request({
                    method: 'POST',
                    url: url,
                    data: params
                }).then(function (res) {
                    var data = res.data;
                    if (data.error && data.error.returnCode != 0) {
                        reject(data);
                        if (opts.showError) {
                            toastError(data.error.returnUserMessage);
                        }
                    } else {
                        resolve(data);
                    }
                }).catch(function (e) {
                    reject(e);
                    if (opts.showError) {
                        toastError('网络错误');
                    }
                }).finally(function () {
                    if (opts.showLoading) {
                        $ionicLoading.hide();
                    }
                });
            });
        };

        this.getCache = function (key) {
            return cachePool[key];
        };

        this.setCache = function (key, value) {
            cachePool[key] = value;
        };

        /**
         * @desc localStorage
         */
        this.setLocalCache = function (key, value) {
            localStorage.setItem(key, angular.toJson(value));
        };

        this.getLocalCache = function (key) {
            return angular.fromJson(localStorage.getItem(key));
        };
    }]);