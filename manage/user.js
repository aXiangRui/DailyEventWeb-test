const {db} = require("../db")

const user = {
    checkUser:async(userName,userPwd)=>{
        const sql = "select * from user where userName = ? and userPwd = ?;";
        const result = await db(sql,[userName,userPwd]);
        return result.length>0?result[0]:null;    
    },

    getUserID:async(userName)=>{
        const sql = "select id from user where userName = ?;";
        const rows = await db(sql,[userName]);
        console.log("1-------",rows)
        return rows.length > 0 ? rows[0].id : null;
    },

    getUserByAddres: async (address)=>{
        const sql = "select * from user where address = ?";
        return await db(sql,[address])
        console.log(user);
    },
    addUser:async(userName,userPwd,address)=>{
       // {userName:'', userPwd:'', address:''}
       const sql = "insert into user (userName,userPwd,address) values (?,?,?);";
       return await db(sql,[userName,userPwd,address])
    },
    update:async(arr)=>{
        const sql = "update user set ? where id = ?"
        return await db(sql,arr)
    },
    delete:(id)=>{
        user.update([{is_del:1},id])
    },

    getAll:async()=>{
        const sql = "select * from user where is_del = 0"
        return await db(sql)
    },

    getPartner:async(userID)=>{
        const sql = "select partnerID from user where id = ?;"
        const partnerid = await db(sql,[userID])
        return partnerid.length>0?partnerid[0].partnerID:null
    }
}

module.exports = user