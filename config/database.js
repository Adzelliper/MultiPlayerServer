if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb+srv://adzelliper:<March31998>@cluster0-t236x.mongodb.net/test?retryWrites=true'}
}
else{
    module.exports = {mongoURI: 'mongodb://localhost:27017/multiplayergamedata'}
}