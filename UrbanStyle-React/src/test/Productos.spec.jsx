import {
    render,
    screen,
    cleanup,
} from "@testing-library/react";

import Productos from "../componentes/paginas/Productos";

describe("Componente Productos",()=>{
    afterEach(() =>{
        cleanup();
    })


It("muestrame el nombre del producto", ()=>{
    render(
        <Productos
        name ="Chaqueta Street Lite"
        price = {129.900}
        tag = "NUEVO"
        /> 
    );
});
});