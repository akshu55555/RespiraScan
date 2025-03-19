import { Sequelize } from "sequelize";
import {DataTypes} from {Sequelize};

export const patient=(sequelize)=>{
        return sequelize.define('patient',{

            id:{

                type:DataTypes.INTEGER,
                autoIncrement : true,
                primaryKey:true,
            },
            name:{
                type:DataTypes.STRING,
                allowNull:false,

            },
            email:{
                type:DataTypes.STRING,
                allowNull:false,

            },
            sex:{
                type:DataTypes.STRING,
                
            },
            
            password:{
                type:DataTypes.STRING,
            },
            age:{
                type:DataTypes.INTEGER,
            },
            bg:{
                type:DataTypes.STRING,
            },
            weight:{
                type:DataTypes.FLOAT,
            },
            height:{
                type:DataTypes.FLOAT,
            },
            

     })
}

export default patient;