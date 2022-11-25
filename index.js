var a=require('express');
var app=a();
var b=require("body-parser");
var s=require("express-session");
var m=require("mongodb").MongoClient;
var url="mongodb+srv://pvscreations:Nagendra2338@cluster0.kajycru.mongodb.net/?retryWrites=true&w=majority";
var n;//sessions

app.use(a.static(__dirname));
app.use(b.urlencoded({extended:true}));//post **
app.use(s({
    secret:"dkslakdlskskslk",
    saveUninitialized:true,
    cookie:{maxAge:100*60*60*24},
    resave:false
}));
var sessionvalidate=()=>{
    if (n.user==undefined | n.pass==undefined){
        return true;
    }
    else{
        return false;
    }
};

app.get("",(req,res)=>{
    
    res.sendFile("abc.html",{root:__dirname});
    
    // res.send("hello");
   
    
   

})
app.get("/gayi",(req,res)=>{
    n=req.session;
    if(!sessionvalidate()){
        res.send("<a href='session'>"+n.user+"</a>");
    }
})
app.post("/gayi",(req,res)=>{
    n=req.session;
    if (sessionvalidate()){
    res.set({'content-type':'text/html'});
    var id=req.body.id;
    var pass=req.body.pass;
    
    m.connect(url,(err,db)=>{
        if (err) throw err;
        dbo=db.db("Credentials");
        dbo.collection("Logins").findOne({"user":id,"password":pass},(err,result)=>{
            
            if (err){throw err}
            else if (result==null){
                res.redirect("/");
                console.log("hellor");
            }
            else{
                
              
                n.user=id;
                n.pass=pass;
                
                res.send("<a href='session'>"+n.user+"</a>");


               
            }
        })
    });
}
else{
    res.redirect("/");
}
});
app.get("/session",(req,res)=>{
    n=req.session;
    if (!sessionvalidate()){
    res.send("are u sure u want to"+n.user+" <a href='logout'>logut</a>");
    }
    else{
        res.redirect("");
    }
});
app.get("/logout",(req,res)=>{
   req.session.destroy();
   res.redirect("/");


});

app.listen(process.env.PORT || 3000, function () {
    console.log("SERVER STARTED PORT: 3000")
});
