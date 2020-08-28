const $$ = (elem) => document.querySelectorAll(elem);
const $ = (elem) => document.querySelector(elem);

const inicializarTabs = () => {
    $$(".tabs li a").forEach((tab) =>
        tab.addEventListener("click", actualizarTab)
    );
};
const actualizarTab = (evento) => {
    // Oculto secciones
    $$(".tab-section").forEach((section) => section.classList.add("is-hidden"));
    // Muestro sección activa
    const idSeccion = evento.target.getAttribute("href");//"#breeds"
    $(idSeccion).classList.remove("is-hidden");
    // Deselecciona tabs
    $$(".tabs li").forEach((tab) => tab.classList.remove("is-active"));
    // Selecciona tab activa
    evento.target.parentElement.classList.add("is-active");
};


inicializarTabs();

/* ### 2. Sección Random

Hacer funcionar la sección`Random`, para eso:

- al cargar la página y al hacer click en el botón, debería cargar una nueva imagen de un gato
    - usar el siguiente endpoint: https://api.thecatapi.com/v1/images/search/
- ** EXTRA:** agregarle al botón la clase`is-loading` antes de hacer el pedido y sacársela cuando se obtiene la respuesta
    <br> */

const btnRandom = document.getElementById("btn-random");
const imgAleatorio = document.getElementById("img");
let data;

const updateImg = async () => {
    const response = await fetch("https://api.thecatapi.com/v1/images/search/");
    data = await response.json();
    imgAleatorio.src = data[0].url;
};
btnRandom.addEventListener("click", (e) => {
    updateImg();

})
updateImg();
/* ### 3. Sección`Búsqueda de razas`

Hacer la sección`Búsqueda de razas`, para eso:

- al hacer click en el botón de búsqueda, obtener el`value` del input de búsqueda
    - con ese dato, hacer una consulta a https://api.thecatapi.com/v1/breeds/search?q=busqueda, reemplazando `busqueda` por el `value` del input
- con la respuesta, actualizar la tabla para mostrar los nombres de las razas
    - ** EXTRA:** agregarle al botón y al input la clase`is-loading` antes de hacer el pedido y sacársela cuando se obtiene la respuesta
        - ** EXTRA:** hacer que funcione cuando se da enter al escribir la búsqueda
            <br> */
const btnSearchBtn = document.getElementById("breed-search-btn");
const inputSearch = document.getElementById("breed-search-input");
const tbody = document.getElementById("breed-search-results");

let dataSearch;

const GetBreed = async () => {
    const response = await fetch(`https://api.thecatapi.com/v1/breeds/search?q=${inputSearch.value}`);
    dataSearch = await response.json();

    tbody.innerHTML = dataSearch.reduce((html, breed) => {
        return html + ` <tr>
            <td>${breed.name}</td>
          </tr>`
    }, "")

};
btnSearchBtn.addEventListener("click", (e) => {
    GetBreed();
})
GetBreed();
/* ### 4. Sección`Razas`

Hacer funcionar la sección`Razas`, para eso

    - al cargar la página, cargar la lista de razas con el endpoint: https://api.thecatapi.com/v1/breeds
    - actualizar el select con los nombres de las razas, el option debería tener como value el id de la raza, por ejemplo
        ```html
  <option value="beng">Bengal</option>
  ```
        - Agregarle al primer`option` el atributo`selected` 
            - cuando se selecciona una raza, actualizar la información con imagen, descripción y temperamento
                - para reaccionar a la selección de una opción en un`select`, tenemos el evento`change`.El`value` de un`select` es el`value` del`option` 
                seleccionado
                    - para actualizar la info de una raza, usar el endpoint: https://api.thecatapi.com/v1/breeds/:id, donde `:id` es el id del value del select,
                    por ejemplo https://api.thecatapi.com/v1/breeds/beng
                    - la imagen la obtenemos de https://api.thecatapi.com/v1/images/search?breed_ids=raza_id, donde `raza_id` es el id de la raza
- al cargar la página, actualizar la info de la raza con la primera raza de la consulta

    <br> */
const breedSelection = document.getElementById("breed-dropdown");
const breedname = document.getElementById("breed-name");
const breedDescription = document.getElementById("breed-description");
const breedimgDescription = document.getElementById("breed-img");
const getInfoTags = document.getElementById("breed-temperament");
let dataBreed;
let dataBreedselect;
let breedImg;
let breedTag;
breedSelection.addEventListener("change", (e) => {
    getSelectedBreedInfo(breedSelection.value);
    getImgInfo(breedSelection.value);
})

const getBreedInfo = async () => {
    const response = await fetch(`https://api.thecatapi.com/v1/breeds`);
    dataBreed = await response.json();
    breedSelection.innerHTML = dataBreed.reduce((html, breed) => {
        return html + ` <option value="${breed.id}">${breed.name}</option>`
    }, "")
    getSelectedBreedInfo(breedSelection.value);
    getImgInfo(breedSelection.value);

};


const getSelectedBreedInfo = async (breed) => {
    const response = await fetch(`https://api.thecatapi.com/v1/breeds/${breed}`);
    dataBreedselect = await response.json();
    breedname.innerHTML = dataBreedselect.name;
    breedDescription.innerHTML = dataBreedselect.description;

}
const getImgInfo = async (breed) => {
    const response = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breed}`);
    breedImg = await response.json();
    breedimgDescription.src = breedImg[0].url;
}

getBreedInfo();
/* ### 5.Lista de razas con filtros

    - La sección debería cargar un listado con todas las razas
        - El contenedor de resultados es el elemento con id`breed-results`
  - Dentro de la misma se encuentra un template de ejemplo
       - La card de cada raza debería contener una imagen de la misma y el nombre de la raza
     - La lista de razas se obtiene con`https://api.thecatapi.com/v1/breeds/`
     - La imagen de una raza se obtiene con`https://api.thecatapi.com/v1/images/search?breed_ids={breed-id}`
- En la respuesta, llega como 1 si tiene el atributo y 0 sino.Por ejemplo, la raza Sphynx tiene "rare" con 1(es exótica), 
"hairless" con 1(no tiene pelos), "short_legs" con 0(tiene piernas largas)
- Para saber si un checkbox está chequeado, se usa la propiedad`checked` del elemento que devuelve un booleano, p.ej.:

```js
document.querySelector(".checkbox").checked; // false
```  - Al modificarse cualquier filtro, debería actualizarse la lista de resultados
        - Debería mostrar la cantidad de resultados obtenidos
            <br>
 */
//primero  armar una lista
//consulta a api para tener todas las razas funcion 
// metodo de renderizado  para la card 
//
//card de cada raza con su imagen y nombre 
//guardar en variable cada consulta 
//agregar botones con checklist de filtrado -hacer filter con todas las razas
//vuelvo a renderizar para mostrar la informacion  
const breedResults = document.getElementById("breed-results");
const hairless = document.getElementById("hairless");
const catFilter = document.querySelectorAll(".breed-filter");
let breedList;
let breddListImg;
let imagenes = [];

const getBreedImage = async (breed) => {
    const response = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${breed.id}`)
    breedListImg = await response.json();
    console.log("Hola")
    return breedListImg[0].url
}

// array de objetos que tiene la info de la raza y la imagen

// for of o for in hacer push de cada imagen en un array
//indice tiene que conincidir con breed list 
// concatenar las dos info y returnas  map parametro de index 

const getBreedList = async () => {
    const response = await fetch(`https://api.thecatapi.com/v1/breeds/`);
    breedList = await response.json();
    const img = [];

    for (const breed of breedList) {
        img.push(await getBreedImage(breed))
    }


    return breedList.map((breed, index) => {
        return { ...breed, img: img[index] }
    })

}
// const breedResults = document.getElementById("breed-results")
const createCard = (breeds) => {
    breedResults.innerHTML = breeds.reduce((html, cat) => {
        return html + ` <div class="column is-6">
            <div class="card">
                <div class="card-image">
                    <figure class="image is-4by3">
                    
                        <img src="${cat.img}" alt="Placeholder image" />
                        
                    </figure>
                </div>
                <div class="card-content">
                    <p id="breed-name-filter" class="title is-5">${cat.name}</p>
                </div>
            </div>
        </div>`
    }, "");
}
let breedComplete;

const initBreedWithFilters = async () => {
    breedComplete = await getBreedList()

    createCard(breedComplete);
}

const filters = []
// seleccionamos los checkbox
//hay que guardar los values de cada uno 
// por cada value hay que filtrarlo con 
catFilter.forEach(catfilter => {
    catfilter.addEventListener("click", e => {
        const { value, checked } = e.target;

        if (checked) {
            filters.push(value);
        } else {
            filters.splice(filters.indexOf(value), 1);
        }

        const breedFilter = breedComplete.filter(breed => {
            return filters.every(filter => breed[filter])
        })

        createCard(breedFilter);
    })
})
initBreedWithFilters()
