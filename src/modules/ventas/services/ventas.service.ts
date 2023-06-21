import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryEnum } from 'src/shared/enums';
import { ProductEntity } from '../entities';
import { Filter, FindOptions, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateProductDto, FilterProductDto, ReadProductDto, UpdateProductDto } from '../dtos';
import { NOTFOUND } from 'dns';
import { PaginationDto } from '../dtos/pagination.dto';

@Injectable()
export class VentasService {
constructor(
    @Inject(RepositoryEnum.PRODUCT_REPOSITORY)private repository:Repository<ProductEntity>
){}
async create(payload: CreateProductDto): Promise<ServiceResponseHttpModel>{
    const newProduct = this.repository.create(payload);
    const productCreated = await this.repository.save(newProduct);//await: espera que se ejecute la accion y luego guarda

    return {data: plainToInstance(ReadProductDto, productCreated)}
}
async catalogue(): Promise<ServiceResponseHttpModel>{
    const response = this.repository.findAndCount({take: 1000});
    return {data: response[0],
            pagination: {totalItems: response[1], limit: 10}
        };
}
async findAll(params?: FilterProductDto): Promise<ServiceResponseHttpModel>{
    if(params?.limit>0 && params?.page>=0){
        return await this.paginateAndFilter(params);   
    }
    const response = await this.repository.findAndCount({
        order: {updateAt: 'DESC'},
    });
    return {
        data: planToInstance(ReadProductDto, response[0]),
        pagination: {totalItems: response[1], limit: 10},

    }
}

async findOne(id: string): Promise<ServiceResponseHttpModel>{
    const response =this.repository.findOne({
        where: {id}
    })
    if(!response){
        throw new NotFoundException('El producto no ha sido encontrado');
    }
    return response;
}

async update(id:string , payload: UpdateProductDto){
    const response = await this.repository.findOneBy({id});
    if(!response){
        throw new NotFoundException('El producto no ha sido encontrado');
    }
    this.repository.merge(response, payload);
    return this.repository.save(response)
}

async remove(id: string){
    const response = await this.repository.findOneBy({id});
    if(!response){
        throw new NotFoundException('El producto no ha sido encontrado');
    }
    return this.repository.softRemove
}

async removeAll(payload: ProductEntity[]){
    return this.repository.softRemove(payload)
}


private async paginateAndFilter(params: FilterProductDto){
    let where:
    FindOptionsWhere<ProductEntity>
    FindOptionsWhere<ProductEntity>[];
    where={};
    let {page, search} = params;
    const {limit} = params;
    if(search){
        search = search.trim(),
        page = 0;
        where = [];
       // where.push({name: ILike('%${seach}')})


    }
    const data= this.repository.findAndCount({
        relations: ['bloodType', 'gender'],
        where,
        take:limit,
        skip: PaginationDto.getOffset(limit, page),
    });
    return 

}
}


