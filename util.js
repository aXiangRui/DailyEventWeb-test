const fs = require("fs")
const http = require('http')
module.exports = {
    read:(url)=>{
    return new Promise((resolve,rejects)=>{
        fs.readFile(url,(err,data)=>{
            if(!err){
               resolve(data)
            }
            else{
                console.log(err);
                rejects(err)
            }
        })    
    })

}    
}
