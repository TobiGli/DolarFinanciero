const ObtenerCards = async () => {
  try {
    const API = await fetch("https://dolarapi.com/v1/dolares");

    const data = await API.json();

    let item = "";
    data.forEach((card) => {
      item += `
            <div class="card" style="width: 30rem;">
                    <div class="card-header">
                        <h5 id="titulomon">${
                          card.nombre.charAt(0).toUpperCase() +
                          card.nombre.slice(1)
                        }</h5>
                    </div>
                    <div class="card-body">
                    <div class="transaccion">
                    <div>
                    <h5>Compra</h5>
                    <p class="card-text"> ${card.compra}</p>
                    </div>
                    <div>
                    <h5>Venta</h5>
                    <p class="card-text"> ${card.venta}</p>
                    </div>
                    </div>
                        <p id="actualizacion">${card.fechaActualizacion}</p>
                    </div>
            </div>
            
    
    
        `;
    });
    document.getElementById("contenedor").innerHTML = item;
  } catch (error) {
    console.log("error");
  }
};

ObtenerCards();

const ObtenerCardEuro = async () => {
  try {
    const API = await fetch("https://dolarapi.com/v1/cotizaciones/eur");

    const data = await API.json();

    let item = "";
    item += `
            <div class="card" style="width: 30rem;">
            <div class="card-header">
                <h3 id="titulomon">${
                  data.nombre.charAt(0).toUpperCase() + data.nombre.slice(1)
                }</h3>
            </div>
            <div class="card-body">
            <div  class="transaccion">
            <div>   
                <h5>Compra</h5>
                <p class="card-text"> ${data.compra}</p>
            </div>
            <div>
                <h5>Venta</h5>
                <p class="card-text"> ${data.venta}</p>
            </div>
            </div>
                <p id="actualizacion">${data.fechaActualizacion}</p>
            </div>
        </div>
                
        
        
            `;
    document.getElementById("contenedorEuro").innerHTML = item;
  } catch (error) {
    console.log("error");
  }
};

ObtenerCardEuro();

const ObtenerCardRealBrasileño = async () => {
  try {
    const API = await fetch("https://dolarapi.com/v1/cotizaciones/brl");

    const data = await API.json();

    let item = "";
    item += `
                <div class="card" style="width: 30rem;">
                <div class="card-header">
                    <h3 id="titulomon">${
                      data.nombre.charAt(0).toUpperCase() + data.nombre.slice(1)
                    }</h3>
                </div>
                <div class="card-body">
                <div  class="transaccion">
                <div>   
                    <h5>Compra</h5>
                    <p class="card-text"> ${data.compra}</p>
                </div>
                <div>
                    <h5>Venta</h5>
                    <p class="card-text"> ${data.venta}</p>
                </div>
                </div>
                    <p id="actualizacion">${data.fechaActualizacion}</p>
                </div>
            </div>
                    
            
            
                `;
    document.getElementById("contenedorRealBrasilero").innerHTML = item;
  } catch (error) {
    console.log("error");
  }
};

ObtenerCardRealBrasileño();

const ObtenerCardPesoChileno = async () => {
  try {
    const API = await fetch("https://dolarapi.com/v1/cotizaciones/clp");

    const data = await API.json();

    let item = "";
    item += `
                <div class="card" style="width: 30rem;">
                <div class="card-header">
                    <h3 id="titulomon">${
                      data.nombre.charAt(0).toUpperCase() + data.nombre.slice(1)
                    }</h3>
                </div>
                <div class="card-body">
                <div  class="transaccion">
                <div>   
                    <h5>Compra</h5>
                    <p class="card-text"> ${data.compra}</p>
                </div>
                <div>
                    <h5>Venta</h5>
                    <p class="card-text"> ${data.venta}</p>
                </div>
                </div>
                    <p id="actualizacion">${data.fechaActualizacion}</p>
                </div>
            </div>
                    
            
            
                `;
    document.getElementById("contenedorPesoChileno").innerHTML = item;
  } catch (error) {
    console.log("error");
  }
};

ObtenerCardPesoChileno();

const ObtenerCardPesoUruguayo = async () => {
  try {
    const API = await fetch("https://dolarapi.com/v1/cotizaciones/uyu");

    const data = await API.json();

    let item = "";
    item += `
                        <div class="card" style="width: 30rem;">
                            <div class="card-header">
                                <h3 id="titulomon">${
                                  data.nombre.charAt(0).toUpperCase() +
                                  data.nombre.slice(1)
                                }</h3>
                            </div>
                            <div class="card-body">
                            <div  class="transaccion">
                            <div>   
                                <h5>Compra</h5>
                                <p class="card-text"> ${data.compra}</p>
                            </div>
                            <div>
                                <h5>Venta</h5>
                                <p class="card-text"> ${data.venta}</p>
                            </div>
                            </div>
                                <p id="actualizacion">${
                                  data.fechaActualizacion
                                }</p>
                            </div>
                        </div>
                        
                
                
                    `;
    document.getElementById("contenedorPesoUruguayo").innerHTML = item;
  } catch (error) {
    console.log("error");
  }
};

ObtenerCardPesoUruguayo();
