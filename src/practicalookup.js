//Versión con estructura 1:N, es decir, varios empleados pueden trabajar en 1 departamento

db.empleados.insertMany([
    { id: 01, 
    nombre: "Juan", 
    fechaEntrada: ISODate("2020-06-21"), 
    departamento: 2 ,
    horas_trabajadas: 30},
    { id: 02, nombre: "Fernando", fechaEntrada: ISODate("2020-07-16"), departamento: 3 ,horas_trabajadas: 13 },
    { id: 03, nombre: "Maria", fechaEntrada: ISODate("2020-11-03"), departamento: 1 ,horas_trabajadas: 56 },
    { id: 04, nombre: "Paco", fechaEntrada: ISODate("2020-01-30"), departamento: 4 ,horas_trabajadas: 65 },
    { id: 05, nombre: "Pepe", fechaEntrada: ISODate("2020-02-08"), departamento: 5 ,horas_trabajadas: 43 }
 ]);

db.departamentos.insertMany([
{id: 1, clasificacion: "Recursos humanos", remuneracionxhora: 39},
{id: 2, clasificacion: "Contadores", remuneracionxhora: 24},
{id: 3, clasificacion: "Ventas", remuneracionxhora: 14},
{id: 4, clasificacion: "Comunicaciones", remuneracionxhora: 29},
{id: 5, clasificacion: "Informatica", remuneracionxhora: 26}
])

//Recoger el sueldo de cada empleado, el empleado y la fecha de contratación
db.empleados.aggregate(
    [
        {
            $lookup: {
                from: "departamentos",
                localField: "departamento",
                foreignField: "id",
                as: "detalles"
            }
        },

        {
            $project: {
                _id:0,
                nombre:1,
                fechaEntrada:1,
                Departamento: "$detalles.clasificacion",
                sueldo: {$multiply: ["$horas_trabajadas", {$arrayElemAt: ["$detalles.remuneracionxhora", 0]}]}
            }
        }
    ]
).pretty()


//Versión con estructura M:N, es decir, varios empleados pueden trabajar en varios departamentos

db.empleados2.insertMany([{
        id: 01,
        nombre: "Juan",
        fechaEntrada: ISODate("2020-06-21"),
        departamentos: 2,
        horas_trabajadas: 30
    },
    {
        id: 02,
        nombre: "Fernando",
        fechaEntrada: ISODate("2020-07-16"),
        departamentos: [3, 2],
        horas_trabajadas: 13
    },
    {
        id: 03,
        nombre: "Maria",
        fechaEntrada: ISODate("2020-11-03"),
        departamentos: [1, 4],
        horas_trabajadas: 56
    },
    {
        id: 04,
        nombre: "Paco",
        fechaEntrada: ISODate("2020-01-30"),
        departamentos: [4, 3],
        horas_trabajadas: 65
    },
    {
        id: 05,
        nombre: "Pepe",
        fechaEntrada: ISODate("2020-02-08"),
        departamentos: [5, 2, 4],
        horas_trabajadas: 43
    }
]);

db.departamentos2.insertMany([{
        id: 1,
        clasificacion: "Recursos humanos",
        remuneracionxhora: 39
    },
    {
        id: 2,
        clasificacion: "Contadores",
        remuneracionxhora: 24
    },
    {
        id: 3,
        clasificacion: "Ventas",
        remuneracionxhora: 14
    },
    {
        id: 4,
        clasificacion: "Comunicaciones",
        remuneracionxhora: 29
    },
    {
        id: 5,
        clasificacion: "Informatica",
        remuneracionxhora: 26
    }
])

//Recoger el sueldo de cada empleado, su nombre, los departamentos a los que pertenece y la fecha de contratación
db.empleados2.aggregate(
    [{
            $lookup: {
                from: "departamentos2",
                localField: "departamentos",
                foreignField: "id",
                as: "detalles"
            }
        },

        {
            $project: {
                _id: 0,
                nombre: 1,
                fechaEntrada: 1,
                Departamentos: "$detalles.clasificacion",
                sueldo: {
                    $multiply: ["$horas_trabajadas", {
                        $arrayElemAt: ["$detalles.remuneracionxhora", 0]
                    }]
                }
            }
        }
    ]
).pretty()