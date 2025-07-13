const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({

    venueid:{
        type: Schema.Types.ObjectId,
        ref: 'Venue',
        required: true
    },
    cusotmmername : 
    {
        type: String,
        required: true
    },
    customeremail: {
        type: String,
        required: true
    },
    customerPhone:{
        type:String,
        required: true
    },
    bookingDate:{
        type: Date,
        required: true
    },
    totalAmount:{
        type:Number,
        required:true
    },
    status:{
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'confirmed'
    }
}    
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
