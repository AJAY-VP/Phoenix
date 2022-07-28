const userModel = require('../model/model.js')

exports.getAllUsers = (req,res) => {
    try{
    console.log('inside controller')
    userModel.getAllUsers((err,data)=>{
        if(err){
            return res.status(500).send({
                status:"error",
                response: err.message || "Some error occured while accessing database"
            })
        }
        else{
            console.log("users data",data)
            return res.status(200).send({
                status:"success",
                response: data
            })
        }
    })
    }catch(error){
        return res.status(500).send({
            status:"error",
            response: error.message || "Some error occured while fetching users"
        })
    }
}