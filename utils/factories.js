
function random () {
    let possible = "12345abcde";
    let id  = "";
    for(let i =0; i<6; i++) {
        let index = Math.floor(Math.random() * 9);
        id+=possible[index];
    }
    return id
}

function getTime (date) {
	return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
}


const factory = {
 createChat  : (name, users,  messages  =[]) => {
     return {
	    id:random(),
		name,
		messages,
		users,
		typingUsers:[]
	}
 },
 createMessage : (message = "", sender = "") => {
    return { 
        id:random(),
        time:getTime(new Date(Date.now())),
        message,
        sender	
    }
 }
    
       
    


}

module.exports = factory;