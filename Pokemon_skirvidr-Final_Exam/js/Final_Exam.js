let pokemon = document.getElementById('pokemonName');
let pokemonID;

//clear fields
function clearFields(){
    document.getElementById('output').innerHTML = '';
    document.getElementById('inGame').value = '';
    document.getElementById('alolan').value = '';
    document.getElementById('shiny').value = '';
    document.getElementById('raid').value = '';
    document.getElementById('nest').value = '';
    document.getElementById('ditto').value = '';
    document.getElementById('candies').value = '';
    document.getElementById('walkCandy').value = '';
    document.getElementById('baseStats').value = '';
    document.getElementById('fastMoves').value = '';
    document.getElementById('chargedMoves').value = '';
};

function pokemonCheck(checking){ 
    let url;
    let client = new XMLHttpRequest();
    //setting url for pokemon stats
    switch (checking){
        case "inGame":
            url = "https://cors-anywhere.herokuapp.com/https://pogoapi.net/api/v1/released_pokemon.json";
            break;
        case "alolan":
            url = "https://cors-anywhere.herokuapp.com/https://pogoapi.net/api/v1/alolan_pokemon.json";
            break;
        case "shiny":
            url = "https://cors-anywhere.herokuapp.com/https://pogoapi.net/api/v1/shiny_pokemon.json";
            break;
        case "raid":
            url = "https://cors-anywhere.herokuapp.com/https://pogoapi.net/api/v1/raid_exclusive_pokemon.json";
            break;
        case "nest":
            url = "https://cors-anywhere.herokuapp.com/https://pogoapi.net/api/v1/nesting_pokemon.json";
            break;
        case "ditto":
            url = "https://cors-anywhere.herokuapp.com/https://pogoapi.net/api/v1/possible_ditto_pokemon.json";
            break;
        case "candies":
            url = "https://cors-anywhere.herokuapp.com/https://pogoapi.net/api/v1/pokemon_candy_to_evolve.json";
            break;
        case "walkCandy":
            url = "https://cors-anywhere.herokuapp.com/https://pogoapi.net/api/v1/pokemon_buddy_distances.json";
            break;
        case "baseStats":
            url = "https://cors-anywhere.herokuapp.com/https://pogoapi.net/api/v1/pokemon_stats.json";
            break;
        case "moveSet":
            url = "https://cors-anywhere.herokuapp.com/https://pogoapi.net/api/v1/current_pokemon_moves.json"
            break;
        default:
            document.getElementById("output").innerHTML = "Cannot find path location";
    };

    client.onreadystatechange = function() {
        if(client.readyState === 4) {
            if ( (client.status >= 200 && client.status < 300) || (client.status === 304) ) {
                let responseObj = JSON.parse(client.responseText);
                
                jQuery.each(responseObj, function(set, key){  
                    //checking if pokemon is in game
                    if (checking === "inGame"){
                        if ((key.name).toLowerCase() === (pokemon.value).toLowerCase()){
                            pokemonID = key.id;
                            document.getElementById(checking).value = "Yes"
                        } else if (document.getElementById(checking).value === ""){
                            document.getElementById(checking).value = "No";
                        };
                    };

                    //if pokemon is in game continue with remaining stats
                    if (document.getElementById("inGame").value === "Yes"){
                        //determines if pokemon can be alolan, shine, in a raid, has a nesting location, can be a ditto
                        if (checking === "alolan" || checking === "shiny" || checking === "raid" || checking === "nest" || checking === "ditto"){
                            if (key.id === pokemonID){
                                document.getElementById(checking).value = "Yes"
                            } else if (document.getElementById(checking).value === ""){ 
                                document.getElementById(checking).value = "No";
                            }
                        };
                        //how many candies it takes to evolve a pokemon or needed walking distance with pokemon to earn a candy
                        if (checking === "candies" || checking === "walkCandy"){
                            for (let i = 0; i < key.length; i++){
                                key[i].pokemon_id;
                                if(key[i].pokemon_id === pokemonID){
                                    if (key[i].form === "Normal"){
                                        if (checking === "candies"){
                                            document.getElementById(checking).value = key[i].candy_required;
                                        }
                                        if (checking === "walkCandy"){
                                            document.getElementById(checking).value = key[i].distance + "km";
                                        }
                                    }
                                }
                            }
                        };
                        //what moves and stats pokemon has
                        if (checking === "moveSet" || checking === "baseStats"){
                            if (key.pokemon_id === pokemonID){
                                if (key.form === "Normal"){
                                    if (checking === "moveSet"){
                                        for (let fastIndex = 0; fastIndex < key.fast_moves.length; fastIndex++){
                                            document.getElementById("fastMoves").value += (key.fast_moves[fastIndex] + "\r\n");
                                        }
                                        for (let chargedIndex = 0; chargedIndex < key.charged_moves.length; chargedIndex++){
                                            document.getElementById("chargedMoves").value += (key.charged_moves[chargedIndex] + "\r\n");
                                        }
                                    }
                                    if (checking === "baseStats"){
                                        document.getElementById("baseStats").value = ("Attack: " + key.base_attack + "\r\nDefense: " + key.base_defense + "\r\nStamina: " + key.base_stamina);
                                    }
                                }
                            }
                        };
                    };
                });    
            };
        };
    };
    client.open("GET", url, true);
    client.send();
};

function setupRequest(){

    clearFields();

    pokemonCheck("inGame");
    pokemonCheck("alolan");
    pokemonCheck("shiny");
    pokemonCheck("raid");
    pokemonCheck("nest");
    pokemonCheck("ditto");
    pokemonCheck("candies");
    pokemonCheck("walkCandy");
    pokemonCheck("baseStats");
    pokemonCheck("moveSet");
}; 

$(document).ready( function() {
    'use strict';
    document.getElementById("pNameBtn").onclick = function(){
        setupRequest();
    };
});
