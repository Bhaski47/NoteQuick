
const URL ="http://localhost/server.php";
const Auth={
  logIn:async({email,pass})=>{
    const res = await fetch(URL,{
      method:'POST',
      headers:{
        'Content-type':'application/json',
      },
      body:JSON.stringify({action:'logIn',email,pass})
    });
    if(!res.ok){
      throw new Error("Login Failed");
    }
    return res.json();
  },
  signIn:async({name,email,pass})=>{
    const res = await fetch(URL,{
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({action:'signIn',email,pass,name})
    })
    if(!res.ok){
      throw new Error('Sign In Failed');
    }
    return res.json();
  }
}

export default Auth