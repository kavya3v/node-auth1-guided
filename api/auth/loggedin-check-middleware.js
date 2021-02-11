module.exports=(req,res,next)=>{
    //session is like that wrist band/hand stamp says authenticated!
    if(req.session && req.session.user){
        next();
    }else{
        res.status(403).json({message: 'User not logged in'})
    }

}