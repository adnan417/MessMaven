
module.exports = (arr1,arr2)=>{

        let takenMeals=0;
        var i;
        for(i=0;i<12;i++)
        {
            if(arr2[i]==='-')
            break;

            takenMeals += arr1[i];
        }
        var totalMeals=i*30*3;
        return (takenMeals/totalMeals)*100;
}