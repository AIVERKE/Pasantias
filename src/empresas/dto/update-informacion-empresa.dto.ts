import { PartialType } from '@nestjs/swagger';
import { CreateInformacionEmpresaDto } from './create-informacion-empresa.dto';

export class UpdateInformacionEmpresaDto extends PartialType(CreateInformacionEmpresaDto) {}
