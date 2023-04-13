import { DataTypes, Optional } from 'sequelize'
import * as sequelize from 'sequelize-typescript'
import Damage from '@/resources/damage/damage.interface';
import PointModel from '@/resources/point/point.model';
import EntityModel from '@/resources/entity/entity.model';

@sequelize.Table
export default class DamageModel extends sequelize.Model<Damage, Optional<Damage,  'point_id' & 'entity_id'>> {
	@sequelize.PrimaryKey
    @sequelize.AllowNull(false)
    @sequelize.ForeignKey(() => PointModel)
    @sequelize.Column(sequelize.DataType.INTEGER)
    point_id!: number

    @sequelize.PrimaryKey
    @sequelize.AllowNull(false)
    @sequelize.ForeignKey(() => EntityModel)
    @sequelize.Column(sequelize.DataType.INTEGER)
    entity_id!: number

    @sequelize.AllowNull(false)
    @sequelize.Column(sequelize.DataType.INTEGER)
    C!: number

    @sequelize.AllowNull
	@sequelize.Column(sequelize.DataType.BOOLEAN)
	x?: boolean
    
	@sequelize.AllowNull
	@sequelize.CreatedAt
	@sequelize.Column(sequelize.DataType.DATE)
	createdAt?: Date

	@sequelize.AllowNull
	@sequelize.UpdatedAt
	@sequelize.Column(sequelize.DataType.DATE)
	updatedAt?: Date
}
