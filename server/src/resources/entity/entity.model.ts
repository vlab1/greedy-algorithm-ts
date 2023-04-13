import { DataTypes, Optional } from 'sequelize'
import * as sequelize from 'sequelize-typescript'
import Entity from '@/resources/entity/entity.interface';
import DamageModel from '@/resources/damage/damage.model';

@sequelize.Table
export default class EntityModel extends sequelize.Model<Entity, Optional<Entity, 'entity_id'>> {
	@sequelize.PrimaryKey
	@sequelize.AutoIncrement
	@sequelize.AllowNull(false)
	@sequelize.Column(sequelize.DataType.INTEGER)
	entity_id!: number

	@sequelize.AllowNull(false)
	@sequelize.Unique
	@sequelize.Column(sequelize.DataType.STRING)
	name_A!: string

	@sequelize.AllowNull
	@sequelize.Column(sequelize.DataType.BOOLEAN)
	y?: boolean

	@sequelize.AllowNull(false)
    @sequelize.Column(sequelize.DataType.INTEGER)
    S!: number

	@sequelize.AllowNull(false)
    @sequelize.Column(sequelize.DataType.INTEGER)
    N!: number

	@sequelize.HasMany(() => DamageModel, {
		onUpdate: "CASCADE",
		onDelete: "CASCADE",
		hooks: true
	})
	damages!: DamageModel[];

	@sequelize.AllowNull
	@sequelize.CreatedAt
	@sequelize.Column(sequelize.DataType.DATE)
	createdAt?: Date

	@sequelize.AllowNull
	@sequelize.UpdatedAt
	@sequelize.Column(sequelize.DataType.DATE)
	updatedAt?: Date
}
