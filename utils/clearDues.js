

module.exports.clearDues = (paymentStatus)=>{
    
    for(let i=0;i<12;i++){
        if(paymentStatus[i]==='No')
        paymentStatus[i]='Yes';
    }

    console.log(paymentStatus);
    return paymentStatus;
}