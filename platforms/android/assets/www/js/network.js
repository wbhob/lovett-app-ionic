angular.module('network-test',[])

.factory('NetworkService', ['$q', function($q) {

var Connection = window.Connection || {
    'ETHERNET': 'ethernet',
    'WIFI': 'wifi',
    'CELL_2G': 'cell_2g',
    'CELL_3G': 'cell_3g',
    'CELL_4G': 'cell_4g',
    'CELL': 'cell',
    'EDGE': 'edge',
    'UNKNOWN': 'unknown',
    'NONE': 'none'
};

var loaded = false;
var connType = null;

return {
    isOnline: function() {
        var blnReturn = true;

        switch (this.getStatus()) {
            case Connection.NONE:
            case Connection.UNKNOWN:
                blnReturn = false;
                break;
        }

        return blnReturn;
    },
    getStatus: function() {
        if (connType) {
            return connType.type;
        }
        if (typeof device !== 'undefined') {
            if ((device.platform === "Android") && navigator && navigator.network && navigator.network.connection) {
                connType = navigator.network.connection || {
                    type: 'UNKNOWN'
                };
            } else {
                if ((device.platform === "iOS") && navigator && navigator.connection) {
                    connType = navigator.connection || {
                        type: 'UNKNOWN'
                    };
                }
            }
        }
        if (!connType) {
            connType = { type: 'none'};
        }
        return connType.type;
    }
};
}]);