var utils = {
    arrAverage(arr) {
        var sum = arr.reduce(function(a, b) {
            return a + b
        });
        
        return sum / arr.length
    }
}

export default utils;