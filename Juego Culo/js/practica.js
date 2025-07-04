//Asyn / Await
function descargarClientes() {
    return new Promise(resolve => {
        console.log('Descargando clientes...');

        setTimeout(() => {
            resolve('Los clientes fueron descargados');
        }, 5000);
    });
}

function descargarPedidos() {
    return new Promise(resolve => {
        console.log('Descargando pedidos...');

        setTimeout(() => {
            resolve('Los pedidos fueron descargados');
        }, 3000);
    });
}

async function app(){
    /*try {
        const resultado = await Promise.all([descargarClientes(), descargarPedidos()]);
        resultado.forEach(element => {
            console.log(element);
        });
    } catch (error) {
        console.error(error);
    }*/

    descargarClientes().then((resultado) => {
        console.log(resultado);
    }).catch((error) => {
        console.error('Error al descargar clientes:', error);
    });
    descargarPedidos().then((resultado) => {
        console.log(resultado);
    }).catch((error) => {
        console.error('Error al descargar pedidos:', error);
    });
}
app();