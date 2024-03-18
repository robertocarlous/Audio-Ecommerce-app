function validateData(data, keys) {
    const dataKeys = Object.keys(data);
    for (const key of keys) {
        if (!dataKeys?.includes(key)){
            return {key, message:"is required", error:true};
        }
    }
    return{
        error:false,
    };
}
module.exports = {validateData,
};