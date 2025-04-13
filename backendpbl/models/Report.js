import { DataTypes } from "sequelize";

const report=(sequelize)=>{
        return sequelize.define('report',{

            id:{

                type:DataTypes.INTEGER,
                autoIncrement : true,
                primaryKey:true,
            },

           patient_id:
           {
            type:DataTypes.INTEGER,
            references: {
                model: 'patients', // name of the table
                key: 'id'     // primary key in products table
              }
           },

            reportPath:{
                type:DataTypes.STRING,
            },
            
            diagnosis:{
                type:DataTypes.STRING,
            }
            

     },{ 
        timestamps: true,
        tableName: 'reports'  // Explicitly set table name if needed
    })
}

export default report;