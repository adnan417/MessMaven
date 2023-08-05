
module.exports = (paymentStatus,charges)=>{

    let sum=0;
    for(let i=0;i<12;i++)
    {

        if(paymentStatus[i]==='No')
        {
            sum += charges[i];
            
        }
        
    }
    return sum;
}