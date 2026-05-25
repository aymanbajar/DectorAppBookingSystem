import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
    userId: {type:String , required:true},
    docId: {type:String , required:true},
    sloteDate:{type:String, required:true},
    sloteTime:{type:String, required:true},
    userData:{type:Object, required:true},
    docData:{type:Object, required:true},
    amount:{type:Number, required:true},
    visitReason:{type:String, default:""},
    date:{type:Number, required:true},
    status:{type:String, enum:["pending","confirmed","rejected","cancelled","completed","follow_up"], default:"pending"},
    cancelled :{type:Boolean,default:false},
    payment:{type:Boolean,default:false},
    isCompleted:{type:Boolean,default:false},
    reviewed:{type:Boolean,default:false}
})
const appointmentModel = mongoose.model('appointments',appointmentSchema)
export default appointmentModel;
