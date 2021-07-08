const mongoose = require("mongoose")

const teamSchema = mongoose.Schema({
    teamName:{
        type: String,
        require: true
    },
    teamDescription:{
        type: String,
        require: true
    },
    teamPhoto:{
        type: String
    },
    url:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now
    },
    teamOwner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    teamMember:[{
        type:  mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    teamAdmin:[{
        type:  mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
})
 
 


module.exports = mongoose.model('team',teamSchema) 