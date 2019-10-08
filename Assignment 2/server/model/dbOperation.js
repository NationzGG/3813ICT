//DBoperation that perform async/await loop action on the queries
class DBoperation {
  async forEachData (array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index]);
    }
  }

  async updateMany (dataList, collection, queryFind, queryUpdate, newData, mode) {
    //If the list is empty then add
    await this.forEachData(dataList, async (item) => {
      let newList = [];
      //Update query to suit with each name
      for (const key in queryFind) {
        queryFind[key] = item;
      }
      //Get data
      const data = await collection.find(queryFind).toArray();

      //Update query
      for (const key in queryUpdate) {
        newList = data[0][key]; 
        if (mode === 'add') {
          // add to list
          newList.push(newData);
        } else {
          //Remove from list
          for (let i = 0; i < newList.length; i++) {
            if (newList[i] === newData) {
              newList.splice(i, 1);
            }
          }
        }
        //Update query
        queryUpdate[key] = newList; //sample {grouplist: ['something new']}
      }
      //Update database
      await collection.updateOne(queryFind, {$set: queryUpdate});
    });
    
  }
}

module.exports = DBoperation;