function validateEmail(email){
    var re = /\S+@\S+/;
    return re.test(email);
};



var BASE_URL="https://s-musicplaylist.herokuapp.com"
var getfavoritesongs=function(){
    fetch(BASE_URL+"/favoritesongs",{
        credentials:"include"
    }).then( function(response){
        if(response.status == 200){
            console.log("server responded?");
            response.json().then(function(data){
                console.log("data received from server",data);
                music.style.display="block";
                signin.style.display="none";
                signup.style.display="none";
                var songList = document.querySelector("#songs");
                songList.innerHTML="";
                data.forEach(function(song){
                
                    var newItem = document.createElement("li");
                    var titleHeading = document.createElement("h3");
                    titleHeading.innerHTML = song.song;
                    newItem.appendChild(titleHeading);
            
                    var artistName = document.createElement("p");
                    artistName.innerHTML = song.artist;
                    newItem.appendChild(artistName);

                    var genreName= document.createElement("p");
                    genreName.innerHTML= song.genre;
                    newItem.appendChild(genreName);

                    var dateh2=document.createElement("p");
                    dateh2.innerHTML=song.date;
                    newItem.appendChild(dateh2);
                
                
                    var deleteButton = document.createElement("button");
                    deleteButton.innerHTML = "Delete";
                    deleteButton.onclick = function () {
                        console.log("delete clicked:", song.id);
                        if (confirm("Are you sure you want to delete:"+song.id+"?")){
                            deleteSong(song.id);
                        }
                    };
                    var updateButton=document.createElement("button");
                    updateButton.innerHTML="Edit";
                    updateButton.onclick=function(){
                        console.log("update clicked:",song.id);            
                        editSong(song);
            

                    };

                    newItem.appendChild(deleteButton);
                    newItem.appendChild(updateButton);
                    songList.appendChild(newItem);
                    
                });
            
            });
        }
    });
}
var music= document.querySelector("#music");
music.style.display="none";

var addButton=document.querySelector("#add-song");
addButton.onclick=function(){
    console.log("add clicked:");

    var song=document.querySelector("#song").value;
    var artist=document.querySelector("#song-artist").value;
    var genre=document.querySelector("#song-genre").value;
    var date=document.querySelector("#song-date").value;
    
    var body="song="+ encodeURIComponent(song);
    body+="&artist="+encodeURIComponent(artist);
    body+="&genre="+encodeURIComponent(genre);
    body+="&date="+encodeURIComponent(date);

    fetch(BASE_URL+"/favoritesongs",{
        method:"POST",
        credentials:"include",
        body:body,
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        }
    }).then(function(){
        console.log("Server responded to POST request")
        getfavoritesongs();
    });
};


var edit=document.querySelector("#edit-form");
var editSong = function (song) {
    edit.style.display="block";
    document.querySelector("#song-edit").value = song.song;
    document.querySelector("#artist-edit").value=song.artist;
    document.querySelector("#genre-edit").value=song.genre;
    document.querySelector("#date-edit").value=song.date;
    var save_button=document.querySelector("#save");
    save_button.onclick = function () {
        saveSong(song.id);
        edit.style.display="none";
    };
};


var saveSong=function(songID){
    var song=document.querySelector("#song-edit").value;
    var artist=document.querySelector("#artist-edit").value;
    var genre=document.querySelector("#genre-edit").value;
    var date=document.querySelector("#date-edit").value;
    
    var body="song="+ encodeURIComponent(song);
    body+="&artist="+encodeURIComponent(artist);
    body+="&genre="+encodeURIComponent(genre);
    body+="&date="+encodeURIComponent(date);
    
    fetch(BASE_URL+"/favoritesongs/"+songID,{
        method:"PUT",
        credentials:"include",
        body:body,
        header:{
            "Content-Type":"application/x-www-form-urlencoded"
        }
    }).then(function(){
        console.log("Server responded to SAVE request")
        getfavoritesongs();
    });
};



var deleteSong=function(songID){
    fetch(BASE_URL+"/favoritesongs/"+songID,{
        method:"DELETE",
        credentials:"include",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        }
    }).then(function(){
        getfavoritesongs();
    });
};

var signin=document.querySelector("#sign-in");
// signin.style.display="none";
var signup=document.querySelector("#sign-up");

var registrationButton=document.querySelector("#add-user");
registrationButton.onclick=function(){
    console.log("register clicked:");
    var firstname=document.querySelector("#firstname").value;
    var lastname=document.querySelector("#lastname").value;
    var email=document.querySelector("#email").value;
    var password=document.querySelector("#password").value;

    if (!validateEmail(email)) { 
        alert("Invalid email!");
        return;
    }

    var body="firstname="+ encodeURIComponent(firstname);
    body+="&lastname="+encodeURIComponent(lastname);
    body+="&email="+encodeURIComponent(email);
    body+="&password="+encodeURIComponent(password);
    signin.style.display="block";
    
    fetch(BASE_URL+"/users",{
        method:"POST",
        credentials:"include",
        body:body,
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        }
    }).then(function(response){
        console.log("Server responded to POST request")
        if(response.status==201){
            alert("Sucessfully Registered")
            signup.style.display="none";
        }
        else if (response.status==401){
            alert("Failed to register. Email already in use")
        }
        else if (response.status == 422){
            alert("Email already in use")
        }
     
    });
};

var signinButton=document.querySelector("#signin");
signinButton.onclick=function(){
    var email=document.querySelector("#email-signin").value;
    var password=document.querySelector("#password-signin").value;
    var body="email="+encodeURIComponent(email);
    body+="&password="+encodeURIComponent(password);
    
    fetch(BASE_URL+"/sessions",{
        method:"POST",
        credentials:"include",
        body:body,
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        }
    }).then(function(response){
        console.log("Server responded to POST request")
        if(response.status==201){
            alert("Sucessfully signed in:Welcome "+email)
            getfavoritesongs();
        }
        else if (response.status==401){
            alert("Failed to sign in")
        }
        


    });
}


getfavoritesongs();