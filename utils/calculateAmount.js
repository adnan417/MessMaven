

module.exports = (attendance)=>{

    const arr=[];
    for(let i=0;i<12;i++){
        arr.push(attendance[i]*30);
    }

    return arr;
}