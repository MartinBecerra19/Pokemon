import { Pokemon } from './pokemon.js';

var tipos = {
    'grass': '#78C850',
    'flying': '#A890F0',
    'poison': '#A040A0',
    'normal': '#A8A878',
    'fighting': '#C03028',
    'ground': '#E0C068',
    'rock': '#B8A038',
    'bug': '#A8B820',
    'ghost': '#705898',
    'steel': '#B8B8D0',
    'fire': '#F08030',
    'water': '#6890f0',
    'electric': '#F8D030',
    'psychic': '#F85888',
    'ice': '#98D8D8',
    'dragon': '#7038F8',
    'dark': '#705848',
    'fairy': '#EE99AC',
    'unknown': '#68A090',
    'shadow': '#68A090'
};

var color = `
background: color_tipo1; 
background: -moz-linear-gradient(-45deg, color_tipo1 40%, color_tipo1 40%, color_tipo2 60%, color_tipo2 60%); 
background: -webkit-linear-gradient(-45deg, color_tipo1 40%,color_tipo1 40%,color_tipo2 60%,color_tipo2 60%); 
background: linear-gradient(135deg, color_tipo1 40%,color_tipo1 40%,color_tipo2 60%,color_tipo2 60%); 
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='color_tipo1', endColorstr='color_tipo2',GradientType=1 ); `
window.onload = function () {
    var pokedex = [];
    var xmlhttp = new XMLHttpRequest();
    var url = "https://pokeapi.co/api/v2/pokemon/";

    var selectType = document.getElementsByClassName("tipos");
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);
    var content = this.document.getElementById("contenido");

    var ordenados = "";
    var orden = 0;
    var pokedexCompleta = {};
    var pokedexTotal;

    var selectOrdenar = document.getElementById("ordenar");
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            pokedexTotal = JSON.parse(this.response).results;
            cargarPokemon("0-151", "g1");
            filtrar();
        }

    }

    function modalPokemon(ev) {
        document.getElementById("nombrePokemon").innerHTML = ev.currentTarget.id;
        document.getElementById('id01').style.display = 'block';
    }

    function mostrarPokemon(pokedex) {
        content.innerHTML = ""
        pokedex.forEach(pokemon => {
            var carta = document.createElement("article");
            carta.className = "tooltip";
            var img = document.createElement("img");
            var a = document.createElement("span");
            img.src = pokemon.img;
            a.innerText = pokemon.name;
            var span = document.createElement("span");
            span.className = "tooltiptext";
            span.innerHTML = "Nombre: " + pokemon.name + "<br>" + " Nº: " + pokemon.id + " <br>" + pokemon.getTypes() + "<br>" + pokemon.getStats();
            carta.appendChild(img);
            carta.appendChild(a);
            carta.appendChild(span);
            carta.id = pokemon.id;
            carta.addEventListener("click", modalPokemon)

            //Añadimos color
            var colorPk = color;
            if (pokemon.types[1] == undefined) {
                colorPk = colorPk.split("color_tipo1").join(tipos[pokemon.types[0]])
                colorPk = colorPk.split("color_tipo2").join(tipos[pokemon.types[0]]);
            } else {
                colorPk = colorPk.split("color_tipo1").join(tipos[pokemon.types[0]])
                colorPk = colorPk.split("color_tipo2").join(tipos[pokemon.types[1]])
            }
            carta.style = colorPk;
            content.appendChild(carta);
        });
    }

    function ordenarPokemon(a, b) {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        if (a.id == b.id) return 0;
    }

    //Lista de tipos
    for (let select of selectType) {
        var opt = document.createElement("option");
        opt.value = "";
        opt.innerText = "Mostrar todos"
        opt.selected = true;
        select.appendChild(opt);

        for (const tipo in tipos) {
            opt = document.createElement("option");
            opt.value = tipo;
            opt.innerText = tipo;
            select.appendChild(opt);
        }
        select.addEventListener("change", filtrar)

    }
    var nombrePkm = document.getElementById("nombrePkm");
    nombrePkm.addEventListener("keyup", filtrar);

    function filtrar() {
        var buscar = nombrePkm.value;
        pokedex = [];
        for (const generacion of generaciones) {
            if (generacion.checked) {
                console.log(pokedexCompleta[generacion.id])
                pokedex = pokedex.concat(pokedexCompleta[generacion.id]);
            }
        }
        mostrarPokemon(pokedex.filter(pokemon => {
            if (pokemon.name.indexOf(buscar) == 0) {
                return true
            }
        }).filter(pokemon => {
            var tipo1 = document.getElementById("tipo1").value;
            var tipo2 = document.getElementById("tipo2").value;
            if (tipo1 == "" && tipo2 == "") {
                return true;
            } else if (tipo1 != "" && tipo2 != "") {
                if (pokemon.types[0] == tipo1 && pokemon.types[1] == tipo2) {
                    return true;
                }
            } else {
                if ((tipo1 == "" && tipo2 == pokemon.types[1]) || (tipo1 == pokemon.types[0] && tipo2 == "")) {
                    return true;
                }
            }
        }).sort(ordenarPk)
        )
    }

    selectOrdenar.addEventListener("change", function (ev) {
        ordenados = ev.currentTarget.value;
        filtrar();
    })

    function ordenarPk(a, b) {
        if (orden == 0) {
            if (ordenados == "") {
                if (a.id < b.id) return -1;
                if (a.id > b.id) return 1;
                if (a.id == b.id) return 0;
            } else {
                if (a.stats[ordenados] > b.stats[ordenados]) return -1;
                if (a.stats[ordenados] < b.stats[ordenados]) return 1;
                if (a.stats[ordenados] == b.stats[ordenados]) return 0;
            }
        } else {
            if (ordenados == "") {
                if (a.id < b.id) return 1;
                if (a.id > b.id) return -1;
                if (a.id == b.id) return 0;
            } else {
                if (a.stats[ordenados] > b.stats[ordenados]) return 1;
                if (a.stats[ordenados] < b.stats[ordenados]) return -1;
                if (a.stats[ordenados] == b.stats[ordenados]) return 0;
            }
        }



    }
    var flecha = document.getElementById("flecha");
    flecha.addEventListener("click", function () {
        if (orden == 0) {
            orden = 1;
            flecha.innerHTML = "&uarr;";
        } else {
            orden = 0;
            flecha.innerHTML = "&darr;";
        }
        filtrar();
    })

    var generaciones = document.getElementsByClassName("generacion");
    for (let generacion of generaciones) {
        generacion.addEventListener("change", function (ev) {
            cargarPokemon(ev.currentTarget.value, ev.currentTarget.id);

        })
    }

    function cargarPokemon(rango, g) {
        if (pokedexCompleta[g] == undefined) {
            var r = rango.split("-");
            var datos;
            if (r[1] == undefined) {
                datos = pokedexTotal.slice(parseInt(r[1]));
            } else {
                datos = pokedexTotal.slice(parseInt(r[0]), parseInt(r[1]));
            }
            var lista = [];
            datos.forEach(pokemon => {
                var xmlhttp2 = new XMLHttpRequest();
                var url2 = pokemon.url;
                xmlhttp2.open("GET", url2, true);
                xmlhttp2.send(null);

                xmlhttp2.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var infoPk = JSON.parse(this.response);
                        var imgPokemon = infoPk.sprites.front_default;
                        var id = infoPk.id
                        var pk = new Pokemon(pokemon.name, imgPokemon, id);
                        for (let tipo of infoPk.types) {
                            pk.types.unshift(tipo.type.name)
                        }
                        for (let estado of infoPk.stats) {
                            pk.stats[estado.stat.name] = estado.base_stat;
                        }
                        lista.push(pk);
                        if (datos.length == lista.length) {
                            pokedexCompleta[g] = lista;
                            filtrar()
                        }
                    }
                }
            });
        } else {
            filtrar()
        }
    }
}
