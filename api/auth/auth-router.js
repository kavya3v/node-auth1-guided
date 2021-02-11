const router = require('express').Router();

const usersdb= require('../users/users-model');
const bcrypt=require('bcryptjs');

router.post('/register', async (req,res)=>{
    let user= req.body;
    //has the original password 2 power 10th time - mechanism for ensuring
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    try {
        const savedUser = await usersdb.add(user)
        res.status(201).json(savedUser);
    } catch (err) { 
         console.log(err);
         res.status(500).json({message:'error registering user',error:err})
    }
})

//login
router.post('/login', async (req,res)=>{
    let {username,password}= req.body;
    console.log('body=',req.body);
    console.log('username=',username);
    try {
        const user = await usersdb.findBy({username}).first();
        console.log('user=',user) 
        //password is from req.body - plain text 
        //- compare it with user.password is from db that we already have
        if (user && bcrypt.compareSync(password,user.password)){
            //to indicate we have logged in here before
            //- if we store it in req.session (session in memory is created)
            req.session.user = user; //create new session for the user
            res.status(200).json({message: `Welcome ${user.username}`})
        }else {
            res.status(401).json({message:'invalid credentials'})
        }
    } catch (err) {     
        console.log(err);
        res.status(500).json({message: "error in login user",error:err})
    }
})

//logout
router.get('/logout',(req,res)=>{
    if(req.session){
        req.session.destroy((err)=>{
            if(err){
                res.send('you can checkout anytime you like')
            }else {
                res.status(204).end()
            }
        })
    }else{
        res.end();
    }
})
module.exports = router;