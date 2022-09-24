const API = "https://api.giphy.com/v1/gifs/search";
let busqueda = "?q=";
const KEY = `&api_key=n7BDWo14GOsaZeMgk2QciN3lEBgOJTIL`;
let qGlobal = '';
let parametersTrending = {
  offset: 0,
  limit: 50,
  offsetSearch: 0,
};

let urlCompleta = ``;
const btn = document.getElementById("btn");
const cargarUrlTrending = async () => {
  try {
    const { offset } = parametersTrending;
    const respuestaTrending = await fetch(
      `https://api.giphy.com/v1/gifs/trending?offset=${offset}&api_key=9TJwQxdCPkWmdRKR3AaZ4Pz6d2dPBTeO`
    );
    if (respuestaTrending.status === 200) {
      const datos = await respuestaTrending.json();
      for (let i = 0; i < datos.data.length; i++) {
        const dataTrending = document.createElement("img");
        dataTrending.src = datos.data[i].images["original"].url;
        dataTrending.className = "img";
        document.getElementById("contenedora").appendChild(dataTrending);

        if (datos.data.length - 1 === i) {
          observador.disconnect();
          observador.observe(dataTrending);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const getData = async (q) => {
  urlCompleta = `${API}${busqueda}${q}&offset=${parametersTrending.offsetSearch}${KEY}`;
  const respuesta = await fetch(urlCompleta);
  if (respuesta.status === 200) {
    const datosGetData = await respuesta.json();
    if (datosGetData.data.length === 0 ) {
        const gif = document.createElement("img");
        document.getElementById("portafolio").appendChild(gif);
        let img = gif.src = "https://images-ext-1.discordapp.net/external/HFwom/static/img/error_pages/crying-cowbow-emoji.gif?width=671&height=671";
    } else {
      renderBadge(q, false);
      for (let i = 0; i < datosGetData.data.length; i++) {
        const gif = document.createElement("img");
        gif.src = datosGetData.data[i].images["original"].url;
        gif.className = "img";
        document.getElementById("portafolio").appendChild(gif);

        if (datosGetData.data.length - 1 === i) {
          observadorSearch.disconnect();
          observadorSearch.observe(gif);
          
        }
      }
    }
  }
};
cargarUrlTrending();
btn.onclick = () => {
  const q = document.getElementById("busqueda").value;
  if (q.length !== 0) {
    qGlobal = q;
    document.getElementById("portafolio").innerHTML = "";
    document.getElementById("contenedora").innerHTML = "";
    getData(q);
  }
};

const renderBadge = (text, renderIncial = false) => {
  const busquedas = localStorage.getItem("busquedas")
    ? localStorage.getItem("busquedas").split(",")
    : [];

  if (renderIncial || !busquedas.some((item) => item === text)) {
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = text;
    span.addEventListener("click", () => {
      document.getElementById("portafolio").innerHTML = "";
      document.getElementById("contenedora").innerHTML = "";
      qGlobal = text;
      getData(text);
    });
    //  span.onclick = getData(text)
    document.getElementById("busquedas").appendChild(span);

    if (!renderIncial) {
      localStorage.setItem("busquedas", [...busquedas, text]);
    }
  }
};

let observador = new IntersectionObserver(
  (entradas) => {
    if (entradas[0].isIntersecting) {
      parametersTrending.offset += 50;
      cargarUrlTrending();
      
    }
  },
  {
    rootMargin: "0px 0px 0px 0px",
    threshold: 1.0,
  }
);

let observadorSearch = new IntersectionObserver(
  (entradasSearch) => {
    if (entradasSearch[0].isIntersecting) {
      parametersTrending.offsetSearch += 50;
      getData(qGlobal);
      if ( offsetSerch === 1000 ) {
        let img ="https://images-ext-1.discordapp.net/external/HFw6wx3ETV8AjplmX83vcCH7fR5wTB_z6XTgwRlMLmc/https/giphy.com/static/img/error_pages/crying-cowbow-emoji.gif?width=671&height=671";
        img();
      }
    }
  },
  {
    rootMargin: "0px 0px 0px 0px",
    threshold: 1.0,
  }
);

if (localStorage.getItem("busquedas") !== null) {
  localStorage
    .getItem("busquedas")
    .split(",")
    .forEach((item) => renderBadge(item, true));
}

getData('');
