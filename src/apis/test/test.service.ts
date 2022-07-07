import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from './entites/test.entity';
import { Cache } from 'cache-manager';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async find() {
    return await this.testRepository.find({});
  }

  async create({ createTestInput }) {
    return await this.testRepository.save({
      ...createTestInput,
    });
  }

  async redisTest() {
    await this.cacheManager.set('1', '성공', {
      ttl: 300,
    });
    return await this.cacheManager.get('1');
  }

  async elasticSearchTest({ name }) {
    await this.elasticsearchService.create({
      id: 'myid9',
      index: 'test',
      document: {
        name,
        value: '안녕하세요',
      },
    });

    const searchResult = await this.elasticsearchService.search({
      index: 'test',
      query: {
        match: {
          name: '이성준',
        },
      },
    });

    const result = searchResult.hits.hits;
    console.log(result);

    // console.log('asdasdsad');
    // const result = searchResult.hits.hits.map((el) => el._source['name']);
    // console.log(result);
    // return result;
    // const result = await this.webtoonRepository.findByIds(resultId);
  }
}
