import { DataTypes } from "sequelize";

const doctor=(sequelize)=>{
        return sequelize.define('doctor',{

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
            
            password:{
                type:DataTypes.STRING,
                allowNull:false
            },
            patients:{
                type:DataTypes.ARRAY(DataTypes.INTEGER),
                allowNull: false,
                defaultValue: [] 
            }
     } ,{ 
        timestamps: true  // ✅ Ensure this line is present
      })
}
export default doctor;