<script>
const pro=new Promise((resolve,reject)=>{
    console.log("1");
    const duration=Math.floor(Math.random()*5000);

    setTimeout(()=>{
        if(Math.random()<0.5){
            resolve(duration)
        }else {
            reject("2")
        }
    },duration);
})
pro.then((data)=>{},(reason)=>{})
</script>