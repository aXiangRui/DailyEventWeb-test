const mysql = require("mysql")

const config ={
        host:"49.232.145.193",
        database:"website",
        user:"root01",
        password:"123456",
}

exports.db = (sql,sqlParams)=>{
    return new Promise((resolve,resject)=>{
        const pool = mysql.createPool(config)
        pool.getConnection((err,conn) =>{
        if(!err){
            conn.query(sql,sqlParams,(e,results)=>{
                if(!e){
                    console.log(results)
                    resolve(results)
                    conn.destroy()
                }
                else{
                    console.log("e",e)
                    //reject(e)
                }
        })
        }
        else{
            console.log(err)          
            //reject(err)
        }
    })
})
}