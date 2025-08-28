import mongoose from "mongoose";
const userSchema=new mongoose.userSchema({
    FirstName:{type:String,required:true},
    LastName:{type:String,required:true},
    Email:{type:String,required:true,unique:true,lowercase:true,trim:true},
    username:{type:String,required:true,unique:true,trim:true},
    password:{type:String,required:true,minlength:8},
    contactNumber:{type:String,required:true,trim:true,maxlength:10,match: [/^[0-9]{10}$/, "Enter valid 10-digit number"]},
    gender:{type:String,required:true,enum:["Male","Female","Other"]},
    isStudent: { type: Boolean, default: false },
    collegeName: { type: String, required: function () { return this.isStudent; } },
    role: { type: String, enum: ["student", "counsellor", "admin", "volunteer"], default: "student" },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User",userSchema);
export default User;