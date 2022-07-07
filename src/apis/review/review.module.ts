import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReivewResolver } from './review.resolver';
import { ReivewService } from './review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  providers: [ReivewResolver, ReivewService],
})
export class ReviewModule {}
