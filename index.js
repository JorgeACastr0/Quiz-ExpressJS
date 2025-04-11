import express from 'express';
import sql from './db.js';

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.get('/api/prueba' , (req, res) => {

    res.send('LA API FUNCIONA');
});

//API PARA VER LOS REGISTROS DE LAS TABLAS
app.get('/api/leerdatospersonas', async (req, res) => {
    try {
      const result = await sql`SELECT * FROM persona ;`;
  
      res.status(200).json({
        success: true,
        message: "DATOS DE LA TABLA",
        data: result
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'ERROR CONSULTANDO LA DB',
        details: error.message || 'ERROR DESCONOCIDO'
      });
    }
  });

  app.get('/api/leerdatoscoches', async (req, res) => {
    try {
      const result = await sql`SELECT * FROM coche ;`;
  
      res.status(200).json({
        success: true,
        message: "DATOS DE LA TABLA",
        data: result
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'ERROR CONSULTANDO LA DB',
        details: error.message || 'ERROR DESCONOCIDO'
      });
    }
  });


router.post('/api/guardar-persona-coche', async (req, res) => {
    const { 
        cedula, 
        nombre, 
        apellido1, 
        apellido2, 
        dni,
        matricula, 
        marca, 
        caballos 
    } = req.body;

    try {
        // Iniciar transacción
        await sql.begin(async sql => {
            // 1. Insertar en tabla persona
            const persona = await sql`
                INSERT INTO persona (
                    cedula, 
                    nombre, 
                    apellido1, 
                    apellido2, 
                    dni
                ) VALUES (
                    ${cedula}, 
                    ${nombre}, 
                    ${apellido1}, 
                    ${apellido2}, 
                    ${dni}
                ) RETURNING id;
            `;
            
            // Obtener el ID de la persona insertada
            const personaId = persona[0].id;

            // 2. Insertar en tabla coche relacionado con la persona
            await sql`
                INSERT INTO coche (
                    matricula, 
                    marca, 
                    caballos, 
                    persona_id
                ) VALUES (
                    ${matricula}, 
                    ${marca}, 
                    ${caballos}, 
                    ${personaId}
                );
            `;
        });

        // Respuesta exitosa
        res.status(201).json({
            success: true,
            message: 'Persona y coche registrados correctamente',
            data: {
                persona: { cedula, nombre, apellido1, apellido2, dni },
                coche: { matricula, marca, caballos }
            }
        });
    } catch (error) {
        console.error('Error al registrar persona y coche:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar persona y coche',
            error: error.message || error
        });
    }
});

  

//Crear puerto de conexion del servidor
const PORT = 3000;

//La conexion la va a escuchar por el puerto 3000 y si 
app.listen(PORT, ()=>{
    console.log('El servidor esta corriendo');

});
