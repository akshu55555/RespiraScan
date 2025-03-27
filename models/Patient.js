import { DataTypes } from "sequelize";

const patient=(sequelize)=>{
        return sequelize.define('patient',{

            id:{

                type:DataTypes.INTEGER,
                autoIncrement : true,
                primaryKey:true,
            },
            name:{
                type:DataTypes.STRING,
                

            },
            email:{
                type:DataTypes.STRING,
                

            },
            sex:{
                type:DataTypes.STRING,
                
            },
            
            pass:{
                type:DataTypes.STRING,
            },
            age:{
                type:DataTypes.INTEGER,
            },
            bg:{
                type:DataTypes.STRING,
            },
            weight:{
                type:DataTypes.INTEGER,
            },
            height:{
                type:DataTypes.INTEGER,
            },
            doc_id:{
                type:DataTypes.INTEGER
            }
            

     },{ 
        timestamps: true  // ✅ Ensure this line is present
      })
}

export default patient;