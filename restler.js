/**
 * Created by Victor on 1/21/2017.
 */
var rest = require('restler');

rest.get('https://maps.googleapis.com/maps/api/geocode/json?address=47520+Avalon+heights+terrace,+CA&key=AIzaSyBeWLtoD-PTsiqaI1QuPR5y1Vas2P3QStA').on('complete', function(result) {
    if (result instanceof Error) {
        console.log('Error:', result.message);
        this.retry(5000); // try again after 5 sec
    } else {
        console.log(result.results[0].geometry.location);
    }
});
// if it returns an error, let the user know that they need to type a valid address