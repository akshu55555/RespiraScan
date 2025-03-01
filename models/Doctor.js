import { Sequelize } from "sequelize";
import { DataTypes } from "sequelize";

export const doctor=(sequelize)=>{
        return sequelize.define('Doctor',{

            NMC_id:{

                type:DataTypes.INTEGER,
                allowNull : false,
                primaryKey:true
            },
            name:{
                type:DataTypes.STRING,
                allowNull:false,

            },
            email:{
                type:DataTypes.STRING,
                allowNull:false,

            },
            contact:{
                type:DataTypes.STRING,
                
            },
            locationbar:{
                type:DataTypes.STRING,
             },
     })
}
export default doctor;